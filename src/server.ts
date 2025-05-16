import express from 'express';
import { env } from 'process';

const app = express();
const port = env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});