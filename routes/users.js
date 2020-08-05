import express from 'express';
import User from '../models/user';

const router = express.Router();


router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find()
      .populate({ path: 'region', select: '_id, title' })
      .populate({ path: 'lang', select: '_id, title' })
      .populate({ path: 'market', select: '_id, title' })
      .populate({ path: 'country', select: '_id, title' })
      .populate({ path: 'issuerSegmentation', select: '_id, title' })
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get('/:_id', async ({ params: { _id } }, res, next) => {
  try {
    const user = await User.findOne({ _id: _id })
      .populate({ path: 'region', select: '_id, title' })
      .populate({ path: 'lang', select: '_id, title' })
      .populate({ path: 'market', select: '_id, title' })
      .populate({ path: 'country', select: '_id, title' })
      .populate({ path: 'issuerSegmentation', select: '_id, title' })
    res.json(user)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async ({ body: { name, region, country, market, lang, issuerSegmentation } }, res, next) => {
  try {
    const user = new User({ name, region, country, market, lang, issuerSegmentation });
    await user.save()
    await user.populate({ path: 'region', select: '_id, title' })
      .populate({ path: 'lang', select: '_id, title' })
      .populate({ path: 'market', select: '_id, title' })
      .populate({ path: 'country', select: '_id, title' })
      .populate({ path: 'issuerSegmentation', select: '_id, title' }).execPopulate()
    res.json(user)
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put('/:_id', async ({ params: { _id }, body }, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true })
      .populate({ path: 'region', select: '_id, title' })
      .populate({ path: 'lang', select: '_id, title' })
      .populate({ path: 'market', select: '_id, title' })
      .populate({ path: 'country', select: '_id, title' })
      .populate({ path: 'issuerSegmentation', select: '_id, title' })
      .exec();
    res.json(user)
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;