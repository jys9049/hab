import jwt from "jsonwebtoken";

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (payload: object) => {
  if (!ACCESS_SECRET_KEY) throw new Error("ACCESS_SECRET_KEY IS NULL");
  return jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "15m" });
};

const verifyAccessToken = (token: string) => {
  if (!ACCESS_SECRET_KEY) return;
  return jwt.verify(token, ACCESS_SECRET_KEY);
};

const generateRefreshToken = (payload: object) => {
  if (!REFRESH_SECRET_KEY) throw new Error("SECRET_KEY IS NULL");
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
};

const verifyRefreshToken = (token: string) => {
  if (!REFRESH_SECRET_KEY) return;
  return jwt.verify(token, REFRESH_SECRET_KEY);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
