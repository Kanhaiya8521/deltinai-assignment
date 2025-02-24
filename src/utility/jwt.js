import jwt from "jsonwebtoken";

const generateJWTToken = (userInfo, tokenSecretKey, expiresIn) => {
  try {
    return jwt.sign(
      {
        user: userInfo.id,
      },
      tokenSecretKey,
      {
        algorithm: "HS256",
        issuer: process.env.APP_URL,
        expiresIn
      }
    );
  } catch (error) {
    throw error;
  }
};

const verifyToken = (token, tokenSecretKey = process.env.ACCESS_TOKEN_SECRET) => {
  try {
    return jwt.verify(token, tokenSecretKey);
  } catch (error) {
    throw error;
  }
};

const decodeJWTToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw error;
  }
};

export { decodeJWTToken, verifyToken, generateJWTToken };
