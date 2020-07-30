import express from 'express';
import User from '../models/user';

const router = express.Router();


router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async ({ body: { name, region, country, market, lang, issuerSegmentation } }, res, next) => {
  try {
    const user = new User({ name, region, country, market, lang, issuerSegmentation });
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put('/:_id', async ({ params: {_id}, body }, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true }).exec();
    res.json(user)
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;