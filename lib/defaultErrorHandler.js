const { errorResult } = require('./errorResult');

if (process.env.DEBUG) {
  const { errJsonDebug } = require('err-json');
  const { error } = require('lambda-console');

  exports.defaultErrorHandler = (err, event, context, callback) => {
    err = errJsonDebug(err, true);

    error({ event, err });

    callback(null, errorResult(500, err));
  };
} else {
  exports.defaultErrorHandler = (err, event, context, callback) =>
    callback(null, errorResult(500));
}
