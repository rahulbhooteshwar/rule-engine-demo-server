import mongoose from 'mongoose'
const languageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  }
}, { timestamps: true });
export default mongoose.model('Language', languageSchema);