import express from 'express';
import router from './src';

const app = express();
const port = 4322;

app.use('/nest', router);

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
