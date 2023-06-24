'use client';

import { pause, play } from '@/app/store/slices/playerSlice';
import { RootState, store } from '@/app/store/store';
import classNames from 'classnames';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsVolumeDown,
  BsVolumeMute,
  BsVolumeOff,
  BsVolumeUp,
} from 'react-icons/bs';
import { useSelector } from 'react-redux';
import styles from '../styles/Player.module.scss';
import LikeButton from './LikeButton';
import Slider from './Slider';

const Player = () => {
  const [volume, setVolume] = useState(0.1);
  const [muted, setMuted] = useState(false);
  const [playback, setPlayback] = useState({ currentTime: 0, duration: 0 });
  const player = useSelector((state: RootState) => state.player);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (player.isPlaying) {
      audioElement.current?.play();
    } else {
      audioElement.current?.pause();
    }
  }, [player.isPlaying]);

  useEffect(() => {
    if (audioElement.current) {
      audioElement.current.volume = volume * volume;
    }
  }, [player.currentTrackId, volume]);

  useEffect(() => {
    if (audioElement.current) {
      audioElement.current.muted = muted;
    }
  }, [player.currentTrackId, muted]);

  const getVolumeIcon = () => {
    if (muted) {
      return <BsVolumeMute className={styles['controls__volume__mute-button__icon']} />;
    }

    if (volume <= 1 && volume > 0.5) {
      return <BsVolumeUp className={styles['controls__volume__mute-button__icon']} />;
    } else if (volume <= 0.5 && volume !== 0) {
      return <BsVolumeDown className={styles['controls__volume__mute-button__icon']} />;
    } else {
      return <BsVolumeOff className={styles['controls__volume__mute-button__icon']} />;
    }
  };

  const togglePlaying = () => {
    if (player.isPlaying) {
      store.dispatch(pause());
    } else {
      store.dispatch(play());
    }
  };

  const playPreviousTrack = () => {
    if (!player.playlist || player.currentTrackId === null) {
      return;
    }

    let previousTrackId = player.currentTrackId - 1;

    if (previousTrackId < 0) {
      previousTrackId += player.playlist.length;
    }

    store.dispatch(play({ trackId: previousTrackId }));
  };

  const playNextTrack = () => {
    if (!player.playlist || player.currentTrackId === null) {
      return;
    }

    let nextTrackId = player.currentTrackId + 1;

    if (nextTrackId >= player.playlist.length) {
      nextTrackId -= player.playlist.length;
    }

    store.dispatch(play({ trackId: nextTrackId }));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles['now-playing']}>
        {player.playlist && player.currentTrackId !== null && player.playlist[player.currentTrackId] && (
          <>
            <img
              className={styles['now-playing__cover']}
              src={`${process.env.NEXT_PUBLIC_API_URL}/static/${player.playlist[player.currentTrackId].cover}`}
            />

            <span className={styles['now-playing__info']}>
              <Link href='/track/id'>
                <p className={styles['now-playing__info__track-name']}>{player.playlist[player.currentTrackId].name}</p>
              </Link>
              <p className={styles['now-playing__info__author']}>{player.playlist[player.currentTrackId].author.login}</p>
            </span>

            <LikeButton liked={player.playlist[player.currentTrackId].liked} />
          </>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.controls__buttons}>
          <button
            onClick={playPreviousTrack}
            disabled={!player.playlist || player.currentTrackId === null}
            className={classNames(styles.controls__buttons__button, styles.controls__buttons__button__secondary)}>
            <BsSkipStartFill className={styles.controls__buttons__button__icon} />
          </button>

          <button
            onClick={togglePlaying}
            disabled={!player.playlist || player.currentTrackId === null}
            className={styles.controls__buttons__button}>
            {player.isPlaying ? (
              <BsPauseCircleFill className={styles.controls__buttons__button__icon} />
            ) : (
              <BsPlayCircleFill className={styles.controls__buttons__button__icon} />
            )}
          </button>

          <button
            onClick={playNextTrack}
            disabled={!player.playlist || player.currentTrackId === null}
            className={classNames(styles.controls__buttons__button, styles.controls__buttons__button__secondary)}>
            <BsSkipEndFill className={styles.controls__buttons__button__icon} />
          </button>
        </div>

        <div className={styles['controls__playback-bar']}>
          <p className={styles['controls__playback-bar__time']}>
            {playback.currentTime ? moment(playback.currentTime * 1000).format('mm:ss') : '00:00'}
          </p>
          <Slider
            value={playback.currentTime}
            onChange={(e) => (audioElement.current!.currentTime = e.currentTarget.valueAsNumber)}
            max={playback.duration}
            disabled={!player.playlist || player.currentTrackId === null}
          />
          <p className={styles['controls__playback-bar__time']}>
            {playback.duration ? moment(playback.duration * 1000).format('mm:ss') : '00:00'}
          </p>
        </div>
      </div>

      <div className={styles.controls__volume}>
        <button onClick={() => setMuted((prev) => !prev)} className={styles['controls__volume__mute-button']}>
          {getVolumeIcon()}
        </button>
        <Slider
          value={volume}
          onChange={(e) => setVolume(e.currentTarget.valueAsNumber)}
          min={0}
          max={1}
          step={0.01}
          className={styles.controls__volume__slider}
        />
      </div>

      {player.playlist && player.currentTrackId !== null && (
        <audio
          autoPlay
          onEnded={playNextTrack}
          onTimeUpdate={() =>
            setPlayback({
              currentTime: audioElement.current?.currentTime ? audioElement.current.currentTime : 0,
              duration: audioElement.current?.duration ? audioElement.current.duration : 0,
            })
          }
          ref={audioElement}
          src={`${process.env.NEXT_PUBLIC_API_URL}/static/${player.playlist[player.currentTrackId].audio}`}></audio>
      )}
    </footer>
  );
};

export default Player;
