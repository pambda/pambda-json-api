# pambda-json-api

JSON API 用の Pambda.

## Installation

```
npm i pambda-json-api
```

## Usage

``` javascript
import { compose, createLambda } from 'pambda';
import { router } from 'pambda-router';
import { jsonApi } from 'pambda-json-api';

export const handler = createLambda(
  compose(
    router()
      .post('/api/(.*)', compose(
         jsonApi({
           reqJsonOnly: true,
           resJsonOnly; true,
           errorHandler: (err, event, context, callback) => {
             // カスタムエラー処理
           },
         }),
         next => (event, context, callback) => {
           // API ハンドリング
         }),
      )
      .toPambda()
  )
);
```

## jsonApi(options)

- `options.reqJsonOnly`
    - リクエストとして JSON のみを受け付けるかどうかの Boolean.
      true の場合、Content-Type が application/json のリクエスト以外はエラーにする。
    - デフォルト値は true.
- `options.resJsonOnly`
    - レスポンスとして JSON のみを返すかどうかの Boolean.
      true の場合、JSON.stringify 呼び出しと Content-Type の設定を行う。
    - デフォルト値は true.
- `options.errorHandler`
    - 引数 `(err, event, context, callback)` の関数。
      エラーが発生した時の処理を指定する。
    - デフォルトは Internal Server Error を返す。

JSON リクエストを受けた時、JSON をパースした結果を `event.body` に設定する。
後続の Pambda は、パース済みの `body` を使うことができる。

また、後続の Pambda が `callback` に渡した結果について、必要なら `body` を JSON 文字列にして返す。

## License

MIT
