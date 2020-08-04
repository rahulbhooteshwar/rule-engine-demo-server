import express from 'express';
import Content from '../models/content';

const router = express.Router();


router.get('/', async (_req, res, next)=> {
  try {
    const contents = await Content.find()
    .sort({createdAt: -1})
    res.json(contents)
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get('/:_id', async ({ params: { _id } }, res, next) => {
  try {
    const content = await Content.findOne({_id}).populate({path: 'rules', select: '_id title'})
    res.json(content)
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
    const content = await Content.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true })
      .populate({path: 'rules', select: '_id title'}).exec()
    res.json(content)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
