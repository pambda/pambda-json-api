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
