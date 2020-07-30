import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose'

import regionRouter from './routes/regions';
import countryRouter from './routes/countries';
import marketRouter from './routes/markets';
import languageRouter from './routes/languages';
import userRouter from './routes/users';
import ruleRouter from './routes/rules';
import contentRouter from './routes/contents';
import issuerSegmentationRouter from './routes/issuer-segmentations';

const app = express();
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/regions', regionRouter);
app.use('/countries', countryRouter);
app.use('/markets', marketRouter);
app.use('/languages', languageRouter);
app.use('/users', userRouter);
app.use('/rules', ruleRouter);
app.use('/contents', contentRouter);
app.use('/issuer-segmentations', issuerSegmentationRouter);
// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

const initDB = async () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log('DB Connected')
  } catch (err) {
    console.error(err);
  }
}
initDB();

export default app;
