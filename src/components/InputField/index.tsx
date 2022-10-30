import React, { FC, useEffect } from 'react'
import { calculator } from '../../calculator'
import styles from './styles.module.scss'

type Props = {
  value: string
  onChange: (value: string) => void
  onEnterKeyPress: () => void
  onRemoveKeyPress: () => void
}

export const InputField: FC<Props> = ({
  value,
  onChange,
  onEnterKeyPress,
  onRemoveKeyPress
}) => {
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnterKeyPress()
        return
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        onRemoveKeyPress()
        return
      }

      if (e.key === '(' || e.key === ')') {
        onChange(e.key)
        return
      }

      if (e.key === '.' || e.key === ',') {
        onChange(e.key)
        return
      }
      
      if (!isNaN(parseFloat(e.key))) {
        onChange(e.key)
        return
      }

      const operator = calculator.operators.find(o => o.symbol.length === 1 && o.symbol === e.key)
      if (operator) {
        onChange(operator.displaySymbol)
        return
      }
    }

    document.addEventListener('keydown', keydown)

    return () => {
      document.removeEventListener('keydown', keydown)
    }
  }, [onChange, onEnterKeyPress, onRemoveKeyPress])

  return (
    <p className={styles.field}>{value}</p>
  )
}