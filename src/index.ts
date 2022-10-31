import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost",
  preflightContinue: false,
};

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors(corsOptions))
app.use(router)

router.options('*', cors(corsOptions));

app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT} 🚀`);
});