import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  }
});

const SongModel = mongoose.models.Song || mongoose.model("Song", songSchema);
export default SongModel;
