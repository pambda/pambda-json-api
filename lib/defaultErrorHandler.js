const { STATUS_CODES } = require('http');

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
