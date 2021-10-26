const express = require('express');
const tikkedAdminUi = require('@tikked/ui');

const app = express();
const port = 4321;

app.use('/admin', tikkedAdminUi({}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
