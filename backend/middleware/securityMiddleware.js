const requests = new Map();

const rateLimit = ({ windowMs, max, keyPrefix }) => (req, res, next) => {
  const now = Date.now();
  const key = `${keyPrefix}:${req.ip}`;
  const record = requests.get(key) || { count: 0, resetAt: now + windowMs };

  if (now >= record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  requests.set(key, record);
  res.set("RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));

  if (record.count > max) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  next();
};

const secureHeaders = (req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Referrer-Policy", "no-referrer");
  res.set("X-Permitted-Cross-Domain-Policies", "none");
  next();
};

module.exports = { rateLimit, secureHeaders };
