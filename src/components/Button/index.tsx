import React, { FC, useCallback } from "react";
import styles from './styles.module.scss'
import cx from 'classnames'

type Props = {
  value: string
  onClick: (value: string) => void
  children?: React.ReactNode
  isPrimary?: boolean
}

export const Button: FC<Props> = ({value, onClick, children, isPrimary}) => {
  const clickHandler = useCallback(() => {
    onClick(value)
  }, [value, onClick])

  return (
    <div className={styles.wrapper}>
      <button className={cx(styles.button, {[styles.primary]: isPrimary})} onClick={clickHandler}>
        {children}
      </button>
    </div>
  )
}