import { describe, expect, test, vi } from 'vitest'
import { sumarPrueba } from './prueba.js'

vi.mock('./suma.ts', async (importOriginal) => {
//   const mod = await importOriginal<typeof import('./suma.ts')>()
  return {
    suma: vi.fn(() => { return 2 })
  }
})

describe('mockedTest', () => {
  test('should be mocked', async () => {
    expect(sumarPrueba).toBe(2)
  })
})
