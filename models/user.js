import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
    // text: true
  },
  image: {
    type: String,
    default: ()=> `https://robohash.org/${new Date().getTime()}?set=set2`
  },
  region: {
    required: 'Region is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  },
  country: {
    required: 'Country is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  },
  lang: {
    required: 'Language is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  },
  market: {
    required: 'Market is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market'
  },
  issuerSegmentation: {
    required: 'IssuerSegmentation is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssuerSegmentation'
  }

}, { timestamps: true });
export default mongoose.model('User', userSchema);