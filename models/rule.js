import mongoose, { Schema } from 'mongoose'
const ruleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  },
  region: {
    required: 'Region is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  },
  conditions: {
    type: [
      {
        attribute: {
          type: String,
          required: 'condition attribute  is required',
        },
        values: {
          type: [
            {
              type: String,
              required: 'condition value is required'
            }
          ],
          required: 'Values array is required'
        }
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