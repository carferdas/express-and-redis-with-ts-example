import axios from 'axios';
import RedisClient from './RedisClient'

export default class ExchangeRateNow {
  private readonly exchangeRateNowEndPoint = "/v2/cryptocurrency/quotes/latest";
  private readonly cryptos = ["bitcoin", "ethereum", "dogecoin", "bnb"]
  private readonly collectionName = "crypto-histogram";

  async getFromCache() {
    const redis = await RedisClient.getClient();

    if (await redis.exists(this.collectionName)) {
      const data = await redis.get(this.collectionName);
      return data ? JSON.parse(data) : {};
    }

    return await this.saveDataOnCache();
  }

  async getRatesNow() {
    let data: any[] = [];
    await axios.get(`${process.env.API_URL + this.exchangeRateNowEndPoint}?slug=${this.cryptos.join(',')}`, {
      headers: {
        [String(process.env.API_AUTH_HEADER_NAME)]: process.env.API_AUTH_SECRET_KEY,
      }
    }).then(response => {
      const date = (new Date).toISOString();

      Object.values(response.data.data).forEach((item: any) => {
        data.push({
          name: item.name,
          symbol: item.symbol,
          price: item.quote["USD"].price,
          date,
        });
      });
    })

    return data;
  }

  async saveDataOnCache() {
    const data = await this.getRatesNow();
    const redis = await RedisClient.getClient();
    redis.set('crypto-histogram', JSON.stringify(data), {
      EX: Number(process.env.TIME_EXPIRED_CRYPTO_DATA_IN_SECONDS),
    });

    return data;
  }
}