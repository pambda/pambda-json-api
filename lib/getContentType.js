const { parse } = require('content-type');

exports.getContentType = headers => {
  const headerValue = getPropInsensitively(headers, 'content-type');

  if (!headerValue) {
    return [null, new Error('Content-Type not exists')];
  }

  try {
    return [parse(headerValue).type, null];
  } catch(err) {
    return [null, err];
  }
};

function getPropInsensitively(obj, prop) {
  const key = Object.keys(obj).find(name => prop === name.toLowerCase());
  if (!key) {
    return undefined;
  }

  return obj[key];
}
