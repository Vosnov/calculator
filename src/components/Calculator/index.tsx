import React, { FC, useCallback, useState } from "react";
import { div, minus, mul, Operator, percent, sqrt, calculator, plus } from "../../calculator";
import { Button } from "../Button";
import { InputField } from "../InputField";
import styles from './styles.module.scss'

const buttons: Array<string | Operator> = ['C', sqrt, percent, div, '7', '8', '9', mul, '4', '5', '6', minus, '1', '2', '3', plus, '00', '0', ',', '=']

export const Calculator: FC = () => {
  const [isCalculated, setIsCalculated] = useState(true)
  const [value, setValue] = useState('')
  const [result, setResult] = useState('0')

  const onRemoveHandler = useCallback(() => {
    setValue(prevValue => prevValue.slice(0, -1))
  }, [])

  const valueHandler = useCallback((v: string) => {
    const operators = calculator.operators.filter(o => !o.isMultiple).map(b => b.displaySymbol)
    const lastSymbolIsOperator = operators.includes(value[value.length - 1])
    if (lastSymbolIsOperator && v === value[value.length - 1]){
      return
    }

    if (lastSymbolIsOperator && operators.includes(v)) {
      onRemoveHandler()
    }

    if (v === 'C') {
      setValue('')
      setResult('0')
      setIsCalculated(true)
      return
    }

    if (v === '=') {
      const calc = `${calculator.calc(value.replace(',', '.'))}`.replace('.', ',')
      setValue(calc)
      setResult(calc)
      setIsCalculated(true)
      return
    }

    if (isCalculated && calculator.isNumeric(v)) setValue('')
    setIsCalculated(false)
    setValue((prev) => prev + v)
  }, [isCalculated, value, onRemoveHandler])

  const onEnterKeyPress = useCallback(() => {
    valueHandler('=')
  }, [valueHandler])

  return (
    <div className={styles.wrapper}>
      <div className={styles.history_wrapper}>
        <InputField onEnterKeyPress={onEnterKeyPress} value={value} onChange={valueHandler} onRemoveKeyPress={onRemoveHandler}/>
      </div>
      <p className={styles.result}>{result}</p>
      <div className={styles.divider}></div>
      <div className={styles.buttons_wrapper}>
        {buttons.map((value) => (
          <Button 
            isPrimary={value === '='}
            key={typeof value === 'string' ? value : value.symbol}
            onClick={valueHandler} 
            value={typeof value === 'string' ? value : value.displaySymbol}
          >{typeof value === 'string' ? value : value.displaySymbol}</Button>
        ))}
      </div>
    </div>
  )
}