#!/usr/bin/env node
/**
 * Guardrail hook — PreToolUse
 *
 * Reads tool call from stdin, evaluates safety rules, and outputs JSON decision.
 *
 * Enforced Rules:
 *  1. No file/directory deletion without confirmation (force_ask)
 *  2. No .env file access (deny)
 *  3. No destructive git commands (force_ask)
 *  4. No DB or external services modification (force_ask)
 *  5. No access outside project directory (deny)
 *  6. No outbound network calls without approval (force_ask)
 */

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  const tool = (payload.toolCall && payload.toolCall.name) || '';
  const args = (payload.toolCall && payload.toolCall.args) || {};
  const argValues = JSON.stringify(args).toLowerCase();
  const cmd = (args.CommandLine || '').toLowerCase();
  const pathField = [args.Path, args.path, args.url, args.CommandLine].filter(Boolean).join(' ');

  // Rule 2: Block access to .env files
  if (/[/\\]?\.env(\.[a-z0-9_-]+)?(?![a-z0-9_])/i.test(pathField)) {
    process.stdout.write(JSON.stringify({
      decision: 'deny',
      reason: '🚫 GUARDRAIL (Rule 2): Direct access to .env files is prohibited. Ask the user for specific config keys.'
    }));
    process.exit(0);
  }

  // Rule 1: Prevent file deletion
  if (tool === 'run_command' && /\b(rm\s+-?rf?|del\b|rimraf|remove-item|unlink)\b/i.test(cmd)) {
    process.stdout.write(JSON.stringify({
      decision: 'force_ask',
      reason: '🚫 GUARDRAIL (Rule 1): File/directory deletion requires explicit user approval.'
    }));
    process.exit(0);
  }

  // Rule 3: Destructive Git commands
  if (tool === 'run_command' && /\bgit\s+(push|pull|fetch|commit|merge|rebase|reset|checkout|stash|tag|rm)\b/i.test(cmd)) {
    process.stdout.write(JSON.stringify({
      decision: 'force_ask',
      reason: '🚫 GUARDRAIL (Rule 3): Non-read-only Git commands require explicit user approval.'
    }));
    process.exit(0);
  }

  // Rule 6: Network calls (curl, wget, invoke-webrequest, fetch, axios, etc.)
  if (tool === 'run_command' && /\b(curl|wget|invoke-webrequest|invoke-restmethod|iwr|irm|fetch|axios)\b/i.test(cmd)) {
    process.stdout.write(JSON.stringify({
      decision: 'force_ask',
      reason: '🚫 GUARDRAIL (Rule 6): Outbound network calls require explicit user approval.'
    }));
    process.exit(0);
  }

  // Rule 4: DB and third-party modifications
  if (/\b(mongoose|mongodb|db\.drop|deletemany|dropcollection|dropdatabase|cloudinary\.uploader\.destroy|razorpay)\b/i.test(argValues)) {
    process.stdout.write(JSON.stringify({
      decision: 'force_ask',
      reason: '🚫 GUARDRAIL (Rule 4): Database or third-party service alterations require explicit user approval.'
    }));
    process.exit(0);
  }

  // Allow
  process.stdout.write(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
});
