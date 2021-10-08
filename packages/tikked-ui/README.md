# Tikked Admin UI (@tikked/ui)

The administrative panel, used to configure Tikked environments as well as toggle flags for those environments.

The package is created as Node [Express](https://expressjs.com/) middleware and is easy to add to your own application.

## Quick Start

First install the package:

```bash
npm install --save @tikked/ui
yarn add @tikked/ui
```

The simply import it and insert it into your Express pipeline:

```js
const express = require('express');
const tikkedAdminUi = require('@tikked/ui');

const app = express();
const port = 8080;

app.use(
  '/tikked',
  tikkedAdminUi({
    // options
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

Now go to [http://localhost:8080/tikked](http://localhost:8080/tikked) to access the Tikked admin panel.

## Options

### adminApiUrl

- **Type:** `string`
- **Default:** `http://localhost:3000`

Url to the tikked admin api.
