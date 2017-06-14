const { parse } = require('content-type');
const { get } = require('caseless-get');

exports.getContentType = headers => {
  const headerValue = get(headers, 'content-type');

  if (!headerValue) {
    return [new Error('Content-Type not exists'), null];
  }

  try {
    return [null, parse(headerValue).type];
  } catch(err) {
    return [err, null];
  }
};
