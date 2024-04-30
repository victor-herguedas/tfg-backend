// import { describe, expect, test, vi } from 'vitest'
// import { multiplicacionPrueba, restaPrueba, sumarPrueba } from './prueba.js'
// import subs from './substract.js'

// // mock es hoisted
// vi.mock('./suma.ts', async (importOriginal) => {
// //   const mod = await importOriginal<typeof import('./suma.ts')>()
//   return {
//     suma: vi.fn(() => { return 2 })
//   }
// })

// vi.mock('./resta.ts')

// describe('mockedTests', () => {
//   test('add should be mocked', async () => {
//     expect(sumarPrueba).toBe(2)
//   })

//   test('substract should be mocked', async () => {
//     expect(restaPrueba).toBe(20)
//   })

//   test('multiplication should not be mocked', async () => {
//     expect(multiplicacionPrueba).toBe(20)
//   })

//   test('multiplication should be mocked', async () => {
//     // doMock no es hoisted
//     vi.doMock('./prueba.ts', () => {
//       return {
//         multiplicacionPrueba: 40
//       }
//     })

//     const { multiplicacionPrueba } = await import('./prueba.js')

//     expect(multiplicacionPrueba).toBe(40)
//     vi.doUnmock('./prueba.ts')
//   })

//   test('test with mocked', () => {
//     vi.mocked(subs.substract).mockReturnValue(200)
//     expect(subs.substract(50, 2)).toBe(200)
//   })
// })
