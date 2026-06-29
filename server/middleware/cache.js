const redis = require("../config/redis");

const cacheMiddleware =
  (keyFn, ttl = 3600) =>
  async (req, res, next) => {
    const key = keyFn(req);
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log("cache hit");
        return res.json(JSON.parse(cached));
      }
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redis.setex(key, ttl, JSON.stringify(data));
        return originalJson(data);
      };
      next();
    } catch (err) {
      next(); //route normally if redis down
    }
  };

module.exports = cacheMiddleware;
