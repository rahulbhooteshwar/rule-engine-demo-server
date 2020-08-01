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
  conditions: {
    type: [
      {
        attribute: String,
        inValues:[String]
      }
    ],
    required: "Conditions are required"
  },
  conditionMatchType: {
    type: String,
    enum: ['ALL', 'ANY'],
    default: 'ALL'
  }
}, { timestamps: true });
export default mongoose.model('Rule', ruleSchema);