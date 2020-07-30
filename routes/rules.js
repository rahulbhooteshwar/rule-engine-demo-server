import express from 'express';
import Rule from '../models/rule';

const router = express.Router();


router.get('/', async ({query:{region}}, res, next)=> {
  try {
    const rules = region ? await Rule.find({region}) : await Rule.find();
    res.json(rules)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, region, conditions, conditionMatchType}}, res, next)=> {
  try {
    const rule = new Rule({title, region, conditions, conditionMatchType});
    await rule.save()
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:_id', async ({ params: {_id}, body }, res, next) => {
  try {
    const rule = await Rule.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true }).exec();
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
