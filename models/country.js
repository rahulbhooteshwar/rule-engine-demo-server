import mongoose from 'mongoose'
const countrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  },
  region: {
    required: 'Region is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  }
}, { timestamps: true });
export default mongoose.model('Country', countrySchema);

