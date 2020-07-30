import express from 'express';
import Market from '../models/market';

const router = express.Router();


router.get('/', async ({query:{region}}, res, next)=> {
  try {
    const markets = region ? await Market.find({region}) : await Market.find();
    res.json(markets)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, region}}, res, next)=> {
  try {
    const market = new Market({ title, region });
    await market.save()
    res.json(market)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
