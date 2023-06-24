'use client';

import classNames from 'classnames';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import styles from '../styles/LikeButton.module.scss';

interface Props {
  className?: string;
  liked: boolean;
  onClick?(): void;
}

const LikeButton = ({ className, liked, onClick }: Props) => {
  return (
    <button onClick={onClick} className={classNames(styles['like-button'], className, liked && styles['like-button__liked'])}>
      {liked ? <BsHeartFill className={styles['like-button__icon']} /> : <BsHeart className={styles['like-button__icon']} />}
    </button>
  );
};

export default LikeButton;
