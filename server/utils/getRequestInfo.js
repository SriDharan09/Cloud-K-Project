
/**
 * Extracts relevant information from the request object for logging purposes.
 * @param {Object} req - Express request object
 * @param {Array} excludedFields - Fields to exclude from the body (e.g., passwords)
 * @returns {Object} - Formatted request information
 */
const getRequestInfo = (req, excludedFields = []) => {
    // Extract body fields excluding sensitive data
    const filteredBody = Object.entries(req.body).reduce((acc, [key, value]) => {
      if (!excludedFields.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  
    return {
      headers: req.headers,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: filteredBody,
    };
  };
  
  module.exports = getRequestInfo;
  