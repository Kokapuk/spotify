'use client';

import { CSSProperties, ChangeEvent, HTMLProps, useRef, useState } from 'react';
import styles from '../styles/Slider.module.scss';
import classNames from 'classnames';

const Slider = (props: HTMLProps<HTMLInputElement>) => {
  const min = (props.min as number) ?? 0;
  const max = (props.max as number) ?? 100;
  const initialValue = (props.value as number) ?? min ?? 0;
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
    props.onChange?.(e);
  };

  const dynamicStyle = {
    '--percentage': `${((((props.value as number) ?? value) - min) / (max - min)) * 100}%`,
  } as CSSProperties;

  return (
    <input
      {...props}
      onChange={handleChange}
      ref={input}
      style={dynamicStyle}
      className={classNames(styles.slider, props.className)}
      type='range'
    />
  );
};

export default Slider;
