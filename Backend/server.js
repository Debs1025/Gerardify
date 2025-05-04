// Import required modules
import express from 'express'; // Web framework for Node.js
import mongoose from 'mongoose'; // MongoDB object modeling tool
import cors from 'cors'; // Middleware for enabling CORS
import multer from 'multer'; // Middleware for handling file uploads
import path from 'path'; // Module for handling file paths
import { fileURLToPath } from 'url'; // Utility to handle ES module file paths
import fs from 'fs'; // File system module for file operations

// Resolve __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); // Get current file's path
const __dirname = path.dirname(__filename); // Get directory name

// Initialize Express app
const app = express();
const PORT = 5001; // Define server port

// Configure middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Serve static files from songs directory
const songsDir = 'C:\\Users\\gerard\\Downloads\\Gerardify-main\\Gerardify-main\\Frontend\\songs'; // Path to songs directory
app.use('/songs', express.static(songsDir)); // Serve songs as static files

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gerardifydb', {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true, // Use new topology engine
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Log connection errors
db.once('open', () => console.log('Connected to MongoDB')); // Log successful connection

// Define Mongoose schemas
const songSchema = new mongoose.Schema({
  title: String, // Song title
  artist: String, // Song artist
  duration: String, // Song duration
  url: String, // URL to song file
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

const playlistSchema = new mongoose.Schema({
  name: String, // Playlist name
  artist: String, // Playlist artist
  year: Number, // Playlist year
  songs: [songSchema], // Array of songs
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

// Create Mongoose models
const Song = mongoose.model('Song', songSchema); // Song model
const Playlist = mongoose.model('Playlist', playlistSchema); // Playlist model

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, songsDir); // Save files to songs directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp + original extension as filename
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3']; // Allowed audio file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only audio files are allowed')); // Reject non-audio files
    }
    cb(null, true); // Accept valid files
  },
});

// Route to create a new playlist
app.post('/playlists', async (req, res) => {
  try {
    const playlist = new Playlist(req.body); // Create new playlist from request body
    await playlist.save(); // Save to database
    res.status(201).json({ message: 'Playlist created successfully', playlist }); // Return success response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Route to get all playlists
app.get('/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.find(); // Fetch all playlists
    res.json(playlists); // Return playlists
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Route to upload a new song
app.post('/songs', upload.single('file'), async (req, res) => {
  try {
    const { title, artist, duration } = req.body; // Extract song metadata
    const song = new Song({
      title,
      artist,
      duration,
      url: `/songs/${req.file.filename}`, // Store relative URL to song file
    });
    await song.save(); // Save song to database
    res.status(201).json({ message: 'Song uploaded successfully', song }); // Return success response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Route to get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find(); // Fetch all songs
    res.json(songs); // Return songs
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Route to update a song by ID
app.put('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get song ID from URL
    const { title, artist, duration } = req.body; // Extract updated metadata
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' }); // Validate required fields
    }
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      { title, artist, duration },
      { new: true, runValidators: true } // Return updated document, run schema validators
    );
    if (!updatedSong) {
      return res.status(404).json({ error: 'Song not found' }); // Handle song not found
    }
    res.status(200).json({ message: 'Song updated successfully', song: updatedSong }); // Return success response
  } catch (err) {
    console.error('Update error:', err); // Log error
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Route to delete a song by ID
app.delete('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get song ID from URL
    const deletedSong = await Song.findByIdAndDelete(id); // Delete song from database
    if (!deletedSong) {
      return res.status(404).json({ error: 'Song not found' }); // Handle song not found
    }
    const filePath = path.join(songsDir, path.basename(deletedSong.url)); // Get file path
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete song file from disk
    }
    res.status(200).json({ message: 'Song deleted successfully', song: deletedSong }); // Return success response
  } catch (err) {
    console.error('Delete error:', err); // Log error
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log server start
});