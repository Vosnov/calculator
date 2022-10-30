import { calculator } from "./calculator"
import {expect, test} from '@jest/globals';

test('Simple', () => {
  expect(calculator.calc('2+2')).toBe(4)
  expect(calculator.calc('3*3')).toBe(9)
  expect(calculator.calc('3*3+3')).toBe(12)
  expect(calculator.calc('2+2*2')).toBe(6)
})

test('Difficult', () => {
  expect(calculator.calc('sqrt25')).toBe(5)
  expect(calculator.calc('5*sqrt25')).toBe(25)
  expect(calculator.calc('5*sqrt25+10')).toBe(35)
  expect(calculator.calc('5*sqrt25+10/2')).toBe(30)
  expect(calculator.calc('100%')).toBe(1)
  expect(calculator.calc('2+100%')).toBe(3)
})

test('Block', () => {
  expect(calculator.calc('(2+2)')).toBe(4)
  expect(calculator.calc('(2+2)*(2+2)')).toBe(16)
  expect(calculator.calc('(2+2)*2')).toBe(8)
  expect(calculator.calc('(2*(3*3))+10')).toBe(28)
  expect(calculator.calc('10+(2*(3*3))')).toBe(28)
  expect(calculator.calc('sqrt(20+5)')).toBe(5)
})