const { getContentType } = require('./getContentType');

exports.isJsonReq = event => {
  if (!event || !event.headers) {
    return false;
  }

  const [type, err] = getContentType(event.headers);

  if (err) {
    return false;
  }

  return type === 'application/json';
}

