const express = require('express');
const tikkedAdminUi = require('@tikked/ui');
const tikkedAdminRest = require("@tikked/admin-rest-api").default;

const app = express();
const port = 4321;

app.use('/admin', tikkedAdminUi({}));
app.use('/admin-2', tikkedAdminRest);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
