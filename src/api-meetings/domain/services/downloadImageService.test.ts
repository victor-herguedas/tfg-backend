import { describe, test } from 'vitest'
import { downloadImageService } from './downloadImageService.js'

describe('downloadImageService', () => {
  test('should download an image', async () => {
    // Ejemplo de uso
    const imageUrl = 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'
    const downloadPath = './images'

    await downloadImageService(imageUrl, downloadPath)
  })
})
