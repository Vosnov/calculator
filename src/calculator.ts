export class Operator {
  constructor(
    public symbol: string,
    public displaySymbol: string,
    public calc: (value1: number, value2: number) => number,
    public priorityLevel = 0
  ) {
  }
}

export const plus = new Operator('+', '+', (v1, v2) => v1 + v2)
export const minus = new Operator('-', '-', (v1, v2) => v1 - v2)
export const mul = new Operator('*', '×', (v1, v2) => v1 * v2, 1)
export const div = new Operator('/', '/', (v1, v2) => v1 / v2, 1)
export const sqrt = new Operator('sqrt', '√', (_, v) => Math.sqrt(v), 2)
export const percent = new Operator('%', '%', (v, _) => v / 100, 1)

class Calculator {
  operators = [plus, minus, mul, div, sqrt, percent]

  calc(str: string) {
    if (str.includes(')')) {
      return this.calcBlocks(str) 
    }
    return this.simpleCalc(str)
  }

  calcBlocks(str: string) {
    let bracketResult = this.calcBlock(str)
    while(bracketResult !== undefined) {
      const result = this.calcBlock(bracketResult)
      if (result === undefined) break
      bracketResult = result
    }
    return !bracketResult ? 0 : this.simpleCalc(bracketResult) 
  }

  calcBlock(str: string) {
    const endIndex = str.indexOf(')')
    if (endIndex === -1) return
    
    let startIndex = -1
    for (let i = endIndex - 1; i >= 0; i--) {
      if (str[i] === "(") {
        startIndex = i
        break
      }
    }
    if (startIndex === -1) return
    const cut = this.cut(str, startIndex, endIndex)
    const value = cut.value.replace(/["("]|[")"]/gm, '')
    return this.past(cut.result, `${this.simpleCalc(value)}`, startIndex)
  }

  simpleCalc(str: string) {
    const group = this.group(str)
    return this.calcGroup(group)
  }

  calcGroup(values: Array<number | Operator>) {
    const filteredOperators = values.filter(v => v instanceof Operator) as Operator[]
    const operators = filteredOperators
      .sort((o1, o2) => o2.priorityLevel - o1.priorityLevel)


    let calcValues = values
    operators.forEach(operator => {
      const newValues: Array<number | Operator> = []

      let currentOperator: Operator| undefined = undefined;
      for (let key = 0; key < calcValues.length; key++) {
        const value = calcValues[key]

        if (value === operator) {
          currentOperator = operator
          continue
        }

        if (currentOperator) {
          const left = newValues[newValues.length - 1]
          const right = value
          const result = currentOperator.calc(
            typeof left === 'number' ? left : NaN,
            typeof right === 'number' ? right : NaN,
          )
          if (typeof left !== 'number') {
            newValues.push(result)
          } else {
            newValues[newValues.length - 1 >= 0 ? newValues.length - 1 : 0] = result
          }
          currentOperator = undefined
          continue
        }

        newValues.push(value)
      }

      if (currentOperator) {
        const left = newValues[newValues.length - 1]
        newValues[newValues.length - 1] = currentOperator.calc(typeof left === 'number' ? left : 0, 0)
      }

      calcValues = newValues
    })

    if (calcValues.length === 1) {
      if (typeof calcValues[0] === 'number') return calcValues[0] as number
    }

    return 0
  }

  group(str: string) {
    const values: Array<number | Operator> = []

    let value = ''
    let operatorSymbol = ''
    for (let key = 0; key < str.length; key++) {
      const char = str[key]

      if (this.isNumeric(char)) {
        value += char

        if (str[key + 1] === undefined || !this.isNumeric(str[key + 1])) {
          values.push(parseFloat(value) || 0)
          value = ''
        }
      } else {
        operatorSymbol += char
        const operator = this.findOperator(operatorSymbol)
        
        if (operator) {
          values.push(operator)
          operatorSymbol = ''
        }
      }
    }

    return values
  }

  findOperator(symbol: string) {
    return this.operators.find(o => o.symbol === symbol || o.displaySymbol === symbol)
  }

  isNumeric(str: string) {
    if (str === '.') return true
    return !isNaN(parseFloat(str)) 
  }

  cut(str: string, startIndex: number, endIndex: number) {
    return {
      value: str.substring(startIndex, endIndex + 1),
      result: str.substring(0, startIndex) + str.substring(endIndex + 1, str.length)
    }
  }

  past(from: string, to: string, startIndex: number) {
    return `${from.substring(0, startIndex)}${to}${from.substring(startIndex, from.length)}`
  }
}

export const calculator = new Calculator()