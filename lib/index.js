const { defaultErrorHandler } = require('./defaultErrorHandler');
const { parse } = require('content-type');
const { get } = require('caseless-get');
const { errorResult } = require('./errorResult');
const { callbackify } = require('lambda-callbackify');

exports.jsonApi = (options = {}) => {
  const {
    reqJsonOnly = true,
    resJsonOnly = true,
    errorHandler = defaultErrorHandler,
  } = options;

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      if (!event || !event.headers) {
        const err = new Error('Invalid event');
        return errorHandler(err, event, context, callback);
      }

      /*
       * Check Content-Type of the request.
       */
      const headerValue = get(event.headers, 'content-type');

      if (!headerValue) {
        if (reqJsonOnly) {
          return callback(null, errorResult(415));
        } else {
          return next(event, context, callback);
        }
      }

      const type = safeContentTypeParse(headerValue);

      if (!type) {
        return callback(null, errorResult(400));
      }

      if (type !== 'application/json') {
        if (reqJsonOnly) {
          return callback(null, errorResult(415));
        } else {
          return next(event, context, callback);
        }
      }

      /*
       * Parse JSON.
       */
      const json = safeJsonParse(event.body);

      if (!json) {
        return callback(null, errorResult(400));
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
};

function safeContentTypeParse(headerValue) {
  try {
    return parse(headerValue).type;
  } catch (err) {
    return null;
  }
}

function safeJsonParse(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}
