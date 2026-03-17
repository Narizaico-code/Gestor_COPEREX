import 'dotenv/config';

import app from './configs/app.js';
import { dbConnection } from './configs/db.js';

const port = process.env.PORT || 3000;

const start = async () => {
  await dbConnection();

  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
};

start();
