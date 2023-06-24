'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsCollection, BsHouseDoor } from 'react-icons/bs';
import styles from '../styles/Navigation.module.scss';
import Playlist from './Playlist';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

const Navigation = () => {
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <div className={styles.container}>
      <div className={classNames('paper', styles.group)}>
        <nav>
          <ul className={styles['link-list']}>
            <li>
              <Link className={classNames(styles.link, pathname === '/' && styles.link__active)} href='/'>
                <h3 className={styles['link__content']}>
                  <BsHouseDoor /> Home
                </h3>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={classNames('paper', styles.group, styles.library)}>
        <h3 className={classNames(styles.link__content, styles.library__header)}>
          <BsCollection /> Your Library
        </h3>
        <nav>
          <ul className={styles['link-list']}>
            <li>
              {token ? (
                <Playlist />
              ) : (
                <Link href='/auth'>
                  <button className={classNames('button', styles['library__sign-up-button'])}>Sign Up</button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
