// import { SERVER_NAME } from '@/utilities/environment.js'
// import { expect, describe, test } from 'vitest'

// describe('whisper routes integration test', () => {
//   test('POST /whisper should exist', async () => {
//     try {
//       const req = await fetch(`${SERVER_NAME}/whisper/`, {
//         method: 'POST'
//       })

//       expect(req.status !== 404).toBeTruthy()
//     } catch (e: any) {
//       expect.fail(e.message as string)
//     }
//   })

//   test('It should accept mp3 files', async () => {

//   })

//   // Debe dar error si no envías un archivo de audio
//   // No debe de aceptar otros formatos que no sean mp3
//   // No debe aceptar archivos de más de x megas
//   // Debe almacenar el archivo que le mandamos (Si se puede dejar en memoria no es necesario)
//   // Debe procesar el archivo y al terminar debe eliminarlo (Si está en memoria eliminarlo de memoria)
//   // Debe de devolver un archivo de texto con lo que se ha transcrito
// })
