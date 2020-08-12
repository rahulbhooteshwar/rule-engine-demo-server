import express, { response } from 'express';
import Rule from '../models/rule';

const router = express.Router();


router.get('/', async ({ query: { regions, keyword } }, res, next) => {
  let criteria = {}
  if (regions) {
    regions = regions.split(',')
    criteria = { regions: { $in: regions } }
  }
  if (keyword) {
    criteria = { ...criteria, title: { $regex: new RegExp(`.*${keyword}.*`, 'mig') } }
  }
  try {
    const rules = await Rule.find(criteria)
      .populate([
        { path: 'regions' },
        { path: 'countries' },
        { path: 'languages' },
        { path: 'markets' },
        { path: 'issuerSegmentations' }
      ])
      .sort({ createdAt: -1 })
    res.json(rules)
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

router.get('/:_id', async ({ params: { _id } }, res, next) => {
  try {
    const rule = await Rule.findOne({ _id: _id })
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({ body }, res, next) => {
  try {
    const rule = new Rule({ ...body });
    await rule.save()
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:_id', async ({ params: { _id }, body }, res, next) => {
  try {
    const rule = await Rule.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true }).exec();
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
