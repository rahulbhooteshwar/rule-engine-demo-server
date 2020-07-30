import mongoose from 'mongoose'
const regionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    text: true
  }
}, { timestamps: true });
export default mongoose.model('Region', regionSchema);