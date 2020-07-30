import express from 'express';
import Language from '../models/language';

const router = express.Router();


router.get('/', async ({query:{country}}, res, next)=> {
  try {
    const languages = country ? await Language.find({country}) : await Language.find();
    res.json(languages)
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post('/', async ({body: {title, country}}, res, next)=> {
  try {
    const language = new Language({ title, country });
    await language.save()
    res.json(language)
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
