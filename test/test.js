const test = require('tape');
const { jsonApi } = require('..');

test('test', t => {
  t.plan(3);

  const pambda = jsonApi();

  const lambda = pambda((event, context, callback) => {
    t.ok(event);
    t.ok(event.body);
    t.ok(typeof(event.body), 'object');
  });

  lambda({
    path: '/',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{}',
  }, {}, (err, result) => {
    t.error(err);
    t.ok(result);
    t.equal(result.statusCode, 200);
  });
});

test('test for wrong content-type', t => {
  t.plan(9);

  const pambda = jsonApi();

  const lambda = pambda((event, context, callback) => {
    t.fail('`next` lambda must not be called in this case');
  });

  /*
   * Invalid content-type.
   */
  lambda({
    path: '/',
    headers: {
      'Content-Type': ';;;',
    },
    body: '{}',
  }, {}, (err, result) => {
    t.error(err);
    t.ok(result);
    t.equal(result.statusCode, 400);
  });

  /*
   * Missing content-type.
   */
  lambda({
    path: '/',
    headers: {
    },
    body: '{}',
  }, {}, (err, result) => {
    t.error(err);
    t.ok(result);
    t.equal(result.statusCode, 415);
  });

  /*
   * Not supported content-type.
   */
  lambda({
    path: '/',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: '{}',
  }, {}, (err, result) => {
    t.error(err);
    t.ok(result);
    t.equal(result.statusCode, 415);
  });
});

test('test for invalid json', t => {
  t.plan(3);

  const pambda = jsonApi();

  const lambda = pambda((event, context, callback) => {
    t.fail('`next` lambda must not be called in this case');
  });

  lambda({
    path: '/',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{x:1}',
  }, {}, (err, result) => {
    t.error(err);
    t.ok(result);
    t.equal(result.statusCode, 400);
  });
});
