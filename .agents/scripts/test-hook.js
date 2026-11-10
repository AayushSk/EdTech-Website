const { execSync } = require('child_process');
const path = require('path');

const testCases = [
  { name: 'Allow normal tool', input: { toolCall: { name: 'read_file', args: { Path: 'src/App.js' } } }, expected: 'allow' },
  { name: 'Block .env file', input: { toolCall: { name: 'read_file', args: { Path: 'server/.env' } } }, expected: 'deny' },
  { name: 'Catch git push', input: { toolCall: { name: 'run_command', args: { CommandLine: 'git push origin main' } } }, expected: 'force_ask' },
  { name: 'Catch curl network call', input: { toolCall: { name: 'run_command', args: { CommandLine: 'curl https://example.com' } } }, expected: 'force_ask' },
  { name: 'Catch rm deletion', input: { toolCall: { name: 'run_command', args: { CommandLine: 'rm -rf node_modules' } } }, expected: 'force_ask' },
  { name: 'Catch DB drop', input: { toolCall: { name: 'run_command', args: { CommandLine: 'db.dropDatabase()' } } }, expected: 'force_ask' }
];

let allPassed = true;
for (const tc of testCases) {
  try {
    const output = execSync('node scripts/guardrail-hook.js', {
      cwd: 'C:\\Users\\ss\\projects\\EdTech-Website\\.agents1',
      input: JSON.stringify(tc.input),
      encoding: 'utf8'
    });
    const res = JSON.parse(output.trim());
    const pass = res.decision === tc.expected;
    console.log((pass ? '[PASS] ' : '[FAIL] ') + tc.name + ' -> decision: ' + res.decision);
    if (!pass) allPassed = false;
  } catch (err) {
    console.log('[ERROR] ' + tc.name + ': ' + err.message);
    allPassed = false;
  }
}

console.log('Result: ' + (allPassed ? 'ALL TESTS PASSED' : 'SOME FAILED'));

