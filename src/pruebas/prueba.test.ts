import { describe, expect, test, vi } from 'vitest'
import { multiplicacionPrueba, restaPrueba, sumarPrueba, sumarPruebita } from './prueba.js'
import subs, { substract2 } from './substract.js'
import { suma } from './suma.js'

// Ejemplo con importOriginal
// vi.mock('./suma.ts', async (importOriginal) => {
// //   const mod = await importOriginal<typeof import('./suma.ts')>()
//   return {
//     suma: vi.fn(() => { return 2 })
//   }
// })

vi.mock('./suma.ts', async () => {
  const mod = await vi.importActual('./suma.ts')
  return {
    ...mod,
    suma: vi.fn(() => { return 2 })
  }
})

vi.mock('./resta.ts')

vi.mock('./substract.ts')

describe('mockedTests', () => {
  test('add should be mocked', async () => {
    expect(sumarPrueba).toBe(2)
  })

  test('substract should be mocked', async () => {
    expect(restaPrueba).toBe(20)
  })

  test('multiplication should not be mocked', async () => {
    expect(multiplicacionPrueba).toBe(20)
  })

  test('multiplication should be mocked', async () => {
    // doMock no es hoisted
    vi.doMock('./prueba.ts', () => {
      return {
        multiplicacionPrueba: 400
      }
    })

    const { multiplicacionPrueba } = await import('./prueba.js')

    expect(multiplicacionPrueba).toBe(400)
    vi.doUnmock('./prueba.ts')
  })

  test('si cambia un mock no debe cambiar variables', async () => {
    vi.mocked(suma).mockReturnValue(9999)

    // No debebe funcionar debido a que sumaPrueba es una variable y
    // Solo llama a la función suma una vez por lo tanto se queda el valor inicial
    expect(sumarPrueba).toBe(2)
  })

  test('test with mocked', () => {
    // Este test no funciona
    vi.mocked(substract2).mockReturnValue(200)
    expect(substract2(50, 2)).toBe(200)

    vi.mocked(subs.substract).mockReturnValue(100)
    expect(subs.substract(50, 2)).toBe(100)
  })

  test('modifico el valor de un mock', async () => {
    vi.mocked(suma).mockReturnValue(30)
    expect(suma(32, 5)).toBe(30)

    vi.mocked(suma).mockReturnValue(9999)
    expect(suma(32, 5)).toBe(9999)
    // expect(sumarPrueba).toBe(9999)

    const moduloOriginal = await vi.importActual('./suma.ts')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    vi.mocked(suma).mockImplementation(moduloOriginal.suma as any)
    expect(suma(32, 5)).toBe(37)

    vi.mocked(suma).mockImplementation((a: number, b: number) => {
      return (a + b + b)
    })
    expect(suma(32, 5)).toBe(42)

    vi.mocked(suma).mockReturnValue(4)
    expect(suma(32, 5)).toBe(4)

    // Devuelve el valor al primer mock
    vi.mocked(suma).mockRestore()
    expect(suma(32, 5)).toBe(2)

    vi.mocked(suma).mockReturnValue(4)
    expect(suma(32, 5)).toBe(4)
  })

  test('modifico un mock y se modifica en otros modulos', () => {
    vi.mocked(suma).mockReturnValue(67)
    expect(sumarPruebita(2, 5)).toBe(67)
  })

  test('import dinamico con mock', async () => {
    interface CuadradoModule {
      cuadrado: (x: number) => number
    }

    // Se mockea con la carpeta __mocks__
    const { cuadrado } = await vi.importMock<CuadradoModule>('./cuadrado.ts')
    expect(cuadrado(4)).toBe(2)
  })

  test('spy', () => {
    function getLatest (index = messages.items.length - 1): any {
      return messages.items[index]
    }

    const messages = {
      items: [
        { message: 'Simple test message', from: 'Testman' }
        // ...
      ],
      getLatest // can also be a `getter or setter if supported`
    }

    const spy = vi.spyOn(messages, 'getLatest')
    expect(spy.getMockName()).toEqual('getLatest')

    expect(messages.getLatest()).toEqual(
      messages.items[messages.items.length - 1]
    )

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementationOnce(() => 'acess-restricted')

    expect(messages.getLatest()).toEqual('acess-restricted')
    expect(spy).toHaveBeenCalledTimes(2)
  })

  test('mock function', () => {
    function getLatest (index = messages.items.length - 1): any {
      return messages.items[index]
    }

    const messages = {
      items: [
        { message: 'Simple test message', from: 'Testman' }
        // ...
      ],
      getLatest // can also be a `getter or setter if supported`
    }

    const mock = vi.fn().mockImplementation(getLatest)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toBeCalledTimes(1)

    mock.mockImplementationOnce(() => 'access-restricted')
    expect(mock()).toEqual('access-restricted')

    expect(mock).toHaveBeenCalledTimes(2)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(3)
  })

  test('toHaveNthReturnedWith', () => {
    const getApples = vi.fn(() => 5)

    getApples.mockReturnValue(4)
    getApples()
    getApples()
    getApples()

    // La tercera llamada a getApples() tiene que haber sido 4
    expect(getApples).toHaveNthReturnedWith(3, 4)

    vi.clearAllMocks()
    expect(getApples()).toBe(4)

    vi.resetAllMocks()
    expect(getApples()).toBe(undefined)

    vi.restoreAllMocks()
    expect(getApples()).toBe(5)
  })

  test('spyOn', () => {
    const cart = {
      getApples: () => 42,
      getMoney: {
        getEuros: () => 20
      }
    }

    const spy = vi.spyOn(cart.getMoney, 'getEuros').mockImplementation(() => 10)

    expect(cart.getMoney.getEuros()).toBe(10)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveReturnedWith(10)
  })

  test('prueba con restore', () => {
    const cart = {
      getApples: () => 42
    }

    const spy = vi.spyOn(cart, 'getApples').mockReturnValue(10)

    console.log(cart.getApples()) // 10
    vi.restoreAllMocks()
    // Esto es debido a que el spy se ha perdido al hacer restore
    console.log(cart.getApples()) // 42
    spy.mockReturnValue(10)
    console.log(cart.getApples()) // still 42!
    vi.restoreAllMocks()
    // el orginal de getApples es 42
    // si getApples fuese de por si una vi.fn en vez de tener que espiarla
    // volveria al valor con el que se inicializa por defeto
    expect(cart.getApples()).toBe(42)
  })
})
