'use client';

import Track from '@/components/Track';
import { Track as TrackType } from '@/utils/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, store } from '../store/store';
import { play } from '../store/slices/playerSlice';

const Liked = () => {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchLikedTracks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/liked`);
      setTracks(response.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data.message ?? err.message);
    }
  };

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    fetchLikedTracks();
  }, [user]);

  const handleLikeToggle = () => {
    fetchLikedTracks();
  };

  const handlePlayRequest = (index: number) => {
    store.dispatch(play({ playList: tracks, trackId: index }));
  };

  return (
    <div className='track-list'>
      {tracks.map((track, index) => (
        <Track key={track._id} track={track} onLikeToggle={handleLikeToggle} onPlayRequest={() => handlePlayRequest(index)} />
      ))}
    </div>
  );
};

export default Liked;
