'use client';

import Link from 'next/link';
import styles from '../styles/Playlist.module.scss';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import axios from 'axios';

const Playlist = () => {
  const pathname = usePathname();
  const [amountOfTracks, setAmountOfTracks] = useState(0);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    (async () => {
      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/liked/amount`);
        setAmountOfTracks(response.data.amount);
      } catch (err: any) {
        console.error(err);
        alert(err.response.data.message ?? err.message);
      }
    })();
  }, [token]);

  return (
    <Link className={classNames(styles.container, pathname === '/liked' && styles.container__active)} href='/liked'>
      <img className={styles.cover} src='https://misc.scdn.co/liked-songs/liked-songs-640.png' />
      <span className={styles.info}>
        <p className={styles.info__title}>Liked</p>
        <p className={styles.info__amount}>{amountOfTracks} tracks</p>
      </span>
    </Link>
  );
};

export default Playlist;
