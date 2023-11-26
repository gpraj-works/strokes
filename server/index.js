import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dbConnect from './config/dbConfig.js';
import { env } from './config/envConfig.js';
import { errorMiddleware } from './middlewares/index.js';
import router from './routes/index.js';

const app = express();
const port = env.port || 3002;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use('/api/v1/', router);

app.use(errorMiddleware);

await dbConnect();

app.listen(port, () => console.log(`🔸 Server running on ${port}`));

export default app;
