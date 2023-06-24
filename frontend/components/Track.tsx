'use client';

import { Track } from '@/utils/types';
import axios from 'axios';
import classNames from 'classnames';
import Link from 'next/link';
import { BsPlayCircleFill } from 'react-icons/bs';
import styles from '../styles/Track.module.scss';
import LikeButton from './LikeButton';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

interface Props {
  track: Track;
  onLikeToggle?(): void;
  onPlayRequest?(): void;
}

const Track = ({ track, onLikeToggle, onPlayRequest }: Props) => {
  const player = useSelector((state: RootState) => state.player);

  const handleLikeClick = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tracks/${track._id}`);
      onLikeToggle?.();
    } catch (err: any) {
      console.error(err);
      alert(err.response.data.message ?? err.message);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={onPlayRequest} className={styles['play-button']}>
        <BsPlayCircleFill className={styles['play-button__icon']} />
        <img className={styles['play-button__cover']} src={`${process.env.NEXT_PUBLIC_API_URL}/static/${track.cover}`} />
      </button>
      <span className={styles.details}>
        <Link href={`/track/${track._id}`}>
          <p
            className={classNames(
              styles['details__track-name'],
              player.playlist &&
                player.currentTrackId !== null &&
                player.playlist[player.currentTrackId]._id === track._id &&
                styles['details__track-name__now-playing']
            )}>
            {track.name}
          </p>
        </Link>
        <p className={styles['details__author']}>{track.author.login}</p>
      </span>
      <LikeButton
        onClick={handleLikeClick}
        liked={track.liked}
        className={classNames(styles['like-button'], track.liked && styles['like-button__liked'])}
      />
    </div>
  );
};

export default Track;
