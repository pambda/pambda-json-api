const { STATUS_CODES } = require('http');

if (process.env.DEBUG) {
  const { errJsonDebug } = require('err-json');
  const { error } = require('lambda-console');

  exports.defaultErrorHandler = (err, event, context, callback) => {
    err = errJsonDebug(err, true);

    error({ event, err });

    callback(null, {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'about:blank',
        title: STATUS_CODES[500],
        status: 500,
        err,
      }),
    });
  };
} else {
  exports.defaultErrorHandler = (err, event, context, callback) => {
    callback(null, {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'about:blank',
        title: STATUS_CODES[500],
        status: 500,
      }),
    });
  };
}
