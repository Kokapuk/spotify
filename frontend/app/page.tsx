'use client';

import Track from '@/components/Track';
import { Track as TrackType } from '@/utils/types';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<TrackType[]>([]);

  const fetchTracks = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tracks?search=${encodeURIComponent(query)}`);
    setTracks(response.data);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await fetchTracks();
    } catch (err: any) {
      console.error(err);
      alert(err.response.data.message ?? err.message);
    }
  };

  const handleLikeToggle = () => {
    fetchTracks();
  };

  return (
    <>
      <header>
        <form onSubmit={handleSubmit} className={styles['search-form']}>
          <BsSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles['search-form__input']}
            type='search'
            placeholder='What do you want to listen to?'
            required
          />
        </form>
      </header>
      <div className='track-list'>
        {tracks.map((track) => (
          <Track onLikeToggle={handleLikeToggle} track={track} key={track._id} />
        ))}
      </div>
    </>
  );
}
