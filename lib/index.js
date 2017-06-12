const { defaultErrorHandler } = require('./defaultErrorHandler');
const { isJsonReq } = require('./isJsonReq');

exports.jsonApi = (options = {}) => {
  const {
    reqJsonOnly = true,
    resJsonOnly = true,
    errorHandler = defaultErrorHandler,
  } = options;

  return next => (event, context, callback) => {
    /*
     * Check Content-Type of the request.
     */
    if (!isJsonReq(event)) {
      if (reqJsonOnly) {
        const err = new Error('Content-Type must be application/json');
        return errorHandler(err, event, context, callback);
      } else {
        return next(event, context, callback);
      }
    }

    /*
     * Parse JSON.
     */
    const [json, jsonError] = safeJsonParse(event.body);

    if (jsonError) {
      return errorHandler(jsonError, event, context, callback);
    }

    event.body = json;

    /*
     * Call the next lambda, and handle a response.
     */
    next(event, context, (err, result) => {
      if (err) {
        return errorHandler(err, event, context, callback);
      }

      if (!resJsonOnly) {
        return callback(null, result);
      }

      if (typeof result.body !== 'string') {
        result.body = JSON.stringify(result.body);
      }

      if (!result.headers) {
        result.headers = {};
      }

      result.headers['Content-Type'] = 'application/json';

      callback(null, result);
    });
  };
};

function safeJsonParse(json) {
  try {
    return [JSON.parse(json), null];
  } catch (e) {
    return [null, e];
  }
}
