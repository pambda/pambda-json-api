# pambda-json-api

Pambda for JSON API.

## Installation

```
npm i pambda-json-api
```

## Usage

``` javascript
const { compose, createLambda } = require('pambda');
const { router } = require('pambda-router');
const { jsonApi } = require('pambda-json-api');

export const handler = createLambda(
  compose(
    router()
      .post('/api/(.*)', compose(
         jsonApi({
           reqJsonOnly: true,
           resJsonOnly: true,
           errorHandler: (err, event, context, callback) => {
             // Custom error handling
           },
         }),
         next => (event, context, callback) => {
           // API handling
         }),
      )
      .toPambda()
  )
);
```

## jsonApi(options)

- `options.reqJsonOnly`
    - The boolean value on whether to accept a JSON request only.
      If true, an error occurs for requests that `Content-Type` is not `application/json`.
    - The default value is true.
- `options.resJsonOnly`
    - The boolean value to whether to return a JSON response only.
      If true, call `JSON.stringify()` and set `Content-Type`.
    - The default value is true.
- `options.errorHandler`
    - The function with argument `(err, event, context, callback)`, called when an error occurs.
    - The default is to return Internal Server Error.

When receiving a JSON request, set the result of parsing JSON to `event.body`. Subsequent Pambda can use parsed `body`.

Also, if necessary, return `body` as a JSON string for the result that subsequent Pambda passes to `callback`.

## License

MIT
