import express from 'express';
import IssuerSegmentation from '../models/issuer-segmentation';

const router = express.Router();


router.get('/', async ({query:{region}}, res, next)=> {
  try {
    const issuerSegmentations = region ? await IssuerSegmentation.find({region}) : await IssuerSegmentation.find();
    res.json(issuerSegmentations)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, region}}, res, next)=> {
  try {
    const issuerSegmentation = new IssuerSegmentation({ title, region });
    await issuerSegmentation.save()
    res.json(issuerSegmentation)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
