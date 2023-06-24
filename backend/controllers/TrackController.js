import TrackModel from '../models/Track.js';

export const upload = async (req, res) => {
  if (req.files.cover?.length === 0 || req.files.audio?.length === 0) {
    return res.status(422).json({ message: 'Cover and audio are required' });
  }

  const cover = req.files.cover[0];
  const audio = req.files.audio[0];

  try {
    const doc = new TrackModel({
      _id: req.trackId,
      name: req.body.name,
      cover: cover.filename,
      audio: audio.filename,
      author: req.user._id,
    });

    const track = await doc.save();
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    const tracks = await TrackModel.find({ name: { $regex: req.query.search, $options: 'i' } }).populate('author');
    const transformedTracks = tracks.map((item) => {
      const { likes, ...track } = item.toObject();
      track.liked = req.user ? likes.some((like) => like.toString() === req.user._id) : false;

      return track;
    });

    res.json(transformedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const findOne = async (req, res) => {
  try {
    const doc = await TrackModel.findById(req.params.id).populate('author');

    if (!doc) {
      return res.status(404).json({ message: 'Track does not exist' });
    }

    const { likes, ...track } = doc.toObject();
    track.liked = req.user ? likes.some((like) => like.toString() === req.user._id) : false;

    return res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const track = await TrackModel.findById(req.params.id);

    if (!track) {
      return res.status(404).json({ message: 'Track does not exists' });
    }

    if (track.likes.includes(req.user._id)) {
      await track.updateOne({ $pull: { likes: req.user._id } });
    } else {
      await track.updateOne({ $push: { likes: req.user._id } });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getLiked = async (req, res) => {
  try {
    const tracks = await TrackModel.find({ likes: { $in: [req.user._id] } }).populate('author');
    const transformedTracks = tracks.map((item) => {
      const { likes, ...track } = item.toObject();
      track.liked = true;

      return track;
    });

    res.json(transformedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getLikedAmount = async (req, res) => {
  try {
    const amount = await TrackModel.count({ likes: { $in: [req.user._id] } });
    res.json({ amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
