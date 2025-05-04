import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const songsDir = 'C:\\Users\\gerard\\Downloads\\Gerardify-main\\Gerardify-main\\Frontend\\songs';
app.use('/songs', express.static(songsDir));

mongoose.connect('mongodb://localhost:27017/gerardifydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  duration: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
});

const playlistSchema = new mongoose.Schema({
  name: String,
  artist: String,
  year: Number,
  songs: [songSchema],
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.model('Song', songSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, songsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only audio files are allowed'));
    }
    cb(null, true);
  },
});

app.post('/playlists', async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json({ message: 'Playlist created successfully', playlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/songs', upload.single('file'), async (req, res) => {
  try {
    const { title, artist, duration } = req.body;
    const song = new Song({
      title,
      artist,
      duration,
      url: `/songs/${req.file.filename}`,
    });
    await song.save();
    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/songs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, artist, duration } = req.body;
      if (!title || !artist) {
        return res.status(400).json({ error: 'Title and artist are required' });
      }
      const updatedSong = await Song.findByIdAndUpdate(
        id,
        { title, artist, duration },
        { new: true, runValidators: true }
      );
      if (!updatedSong) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(200).json({ message: 'Song updated successfully', song: updatedSong });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: err.message });
    }
  });

app.delete('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }
    const filePath = path.join(songsDir, path.basename(deletedSong.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'Song deleted successfully', song: deletedSong });
  } catch (err) {
    console.error('Delete error:', err); // Server-side log
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});