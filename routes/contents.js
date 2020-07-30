import express from 'express';
import Content from '../models/content';

const router = express.Router();


router.get('/', async ({query:{region}}, res, next)=> {
  try {
    const contents = region ? await Content.find({region}) : await Content.find();
    res.json(contents)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, rules, ruleMatchType}}, res, next)=> {
  try {
    const content = new Content({title, rules, ruleMatchType});
    await content.save()
    res.json(content)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:_id', async ({ params: {_id}, body }, res, next) => {
  try {
    const content = await Content.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true }).exec();
    res.json(content)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
