import express from 'express';
import Region from '../models/region';

const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const regions = await Region.find();
    res.json(regions)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title}}, res, next)=> {
  try {
    const region = new Region({ title });
    await region.save()
    res.json(region)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
