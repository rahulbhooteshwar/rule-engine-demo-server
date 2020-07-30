import express from 'express';
import Country from '../models/country';

const router = express.Router();


router.get('/', async ({query:{region}}, res, next)=> {
  try {
    const countries = region ? await Country.find({region}) : await Country.find();
    res.json(countries)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, region}}, res, next)=> {
  try {
    const country = new Country({ title, region });
    await country.save()
    res.json(country)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
