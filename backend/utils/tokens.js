const crypto = require("crypto");

const createSecureToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

module.exports = { createSecureToken, hashToken };
