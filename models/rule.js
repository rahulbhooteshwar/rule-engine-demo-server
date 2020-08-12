import mongoose, { Schema } from 'mongoose'
const ruleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  },
  regions: [{
    required: 'Region is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  }],
  countries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  }],
  languages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  }],
  markets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market'
  }],
  issuerSegmentations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssuerSegmentation'
  }],
  conditionMatchType: {
    type: String,
    enum: ['ALL', 'ANY'],
    default: 'ALL'
  }
}, { timestamps: true });
export default mongoose.model('Rule', ruleSchema);
