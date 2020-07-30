import mongoose from 'mongoose'
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  },
  image: {
    type: String,
    default: () => `https://robohash.org/${new Date().getTime()}?set=set1`
  },
  rules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rule',
      required: true
    }
  ],
  ruleMatchType: {
    type: String,
    enum: ['ALL', 'ANY'],
    default: 'ALL'
  }
}, { timestamps: true });
export default mongoose.model('Content', contentSchema);