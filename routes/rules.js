import express from 'express';
import Rule from '../models/rule';
import market from '../models/market';
import country from '../models/country';
import lang from '../models/language';
import issuerSegmentation from '../models/issuer-segmentation';

const router = express.Router();


router.get('/', async ({ query: { regions, keyword } }, res, next) => {
  let criteria = {}
  if (regions) {
    regions = regions.split(',')
    criteria = { regions: { $in: regions } }
  }
  if (keyword) {
    criteria = {...criteria, $text: {$search: keyword, $caseSensitive: false}}
  }
  try {
    const entityMap = { country, lang, market, issuerSegmentation }
    const rules = await Rule.find(criteria).populate({ path: 'regions', select: '_id title' }).sort({ createdAt: -1 })
    let populatedRules = rules.map(async rule => {
      let conditions = rule.conditions.map(async condition => {
        const data = await entityMap[condition.attribute].find({ _id: { $in: condition.inValues } }, '_id, title')
        // console.log(condition.attribute, data)
        return {attribute: condition.attribute, inValues: data}
      })
      // We need await as map will return Promises beacuse of async operations
      conditions = await Promise.all(conditions)
      const { _id, title, conditionMatchType, regions } = rule;
      return { _id, title, conditionMatchType, regions, conditions: conditions}
    })
      // We need await as map will return Promises beacuse of async operations
    //https://zellwk.com/blog/async-await-in-loops/
    populatedRules = await Promise.all(populatedRules)
    res.json(populatedRules)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:_id', async ({params: {_id}}, res, next) => {
  try {
    const rule = await Rule.findOne({_id: _id})
    res.json(rule)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({ body: { title, regions, conditions, conditionMatchType } }, res, next) => {
  try {
    const rule = new Rule({ title, regions, conditions, conditionMatchType });
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
