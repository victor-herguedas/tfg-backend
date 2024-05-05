import { multiplicacion } from './multiplicacion.js'
import { resta } from './resta.js'
import { suma } from './suma.js'

export const sumarPrueba = suma(2, 5)
export const sumarPruebita = (a: number, b: number): number => { return suma(a, b) }
console.log(sumarPrueba)

export const restaPrueba = resta(5, 4)

export const multiplicacionPrueba = multiplicacion(5, 4)
