const { STATUS_CODES } = require('http');

exports.errorResult = (statusCode, err) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'about:blank',
    title: STATUS_CODES[statusCode],
    status: statusCode,
    err,
  }),
});
