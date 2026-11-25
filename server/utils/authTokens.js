const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const env = require("../config/env");
const RefreshSession = require("../models/RefreshSession");

const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

const createAccessToken = (user) =>
	jwt.sign(
		{ email: user.email, id: user._id, accountType: user.accountType },
		env.JWT_SECRET,
		{ expiresIn: "15m" }
	);

const createRefreshToken = (user) =>
	jwt.sign(
		{ id: user._id, type: "refresh" },
		env.JWT_REFRESH_SECRET,
		{ expiresIn: "3d" }
	);

const cookieOptions = (maxAge) => ({
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
	path: "/",
	maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
	res.cookie("refreshToken", refreshToken, {
		...cookieOptions(REFRESH_TOKEN_MAX_AGE_MS),
		path: "/api/v1/auth",
	});
};

const clearAuthCookies = (res) => {
	res.clearCookie("accessToken", { path: "/" });
	res.clearCookie("refreshToken", {
		path: "/api/v1/auth",
	});
	res.clearCookie("token", { path: "/" });
};

const createRefreshSession = async (user) => {
	const refreshToken = createRefreshToken(user);
	const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);

	await RefreshSession.create({
		user: user._id,
		tokenHash: hashToken(refreshToken),
		expiresAt,
	});

	return refreshToken;
};

const revokeRefreshSession = async (refreshToken) => {
	if (!refreshToken) return;
	await RefreshSession.findOneAndUpdate(
		{ tokenHash: hashToken(refreshToken), revokedAt: null },
		{ revokedAt: new Date() }
	);
};

const revokeUserRefreshSessions = async (userId) => {
	await RefreshSession.updateMany(
		{ user: userId, revokedAt: null },
		{ revokedAt: new Date() }
	);
};

module.exports = {
	ACCESS_TOKEN_MAX_AGE_MS,
	REFRESH_TOKEN_MAX_AGE_MS,
	createAccessToken,
	createRefreshToken,
	createRefreshSession,
	hashToken,
	setAuthCookies,
	clearAuthCookies,
	revokeRefreshSession,
	revokeUserRefreshSessions,
};
