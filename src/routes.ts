import express from 'express';
import ExchangeRate from './services/ExchangeRate';

const exchangeRate = new ExchangeRate();
const router = express.Router();

router.get('/cryto/prices', async (req, res) => {
  const items = await exchangeRate.getFromCache();

  res.json(items);
})

export default router;