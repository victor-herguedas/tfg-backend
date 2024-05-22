import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getUserTokenMother } from '../../api-auth/test/userTokenMother.js'
import { type Response, type Request } from 'express'
import { authMiddleware } from './authMiddleware.js'
import { restartDatabase } from '../../utilities/test/testUtils.js'
import { findUserByEmail } from '../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { UnautorizedError } from '../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

describe('authMiddleware', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  const authToken = getUserTokenMother()
  const req = {
    cookies: {
      JWT: authToken
    },
    body: {}
  } as unknown as Request

  const res = vi.fn(() => { return {} }) as unknown as Response

  test('Should add user to the request body', async () => {
    const registerUser = await findUserByEmail('exist@test.com')
    const spy = vi.fn()
    await authMiddleware(req, res, () => {
      spy()
      const user = req.body.user
      expect(user.email).toBe(registerUser?.email)
      expect(user.name).toBe(registerUser?.name)
      expect(user.password).toBe(registerUser?.password)
    })
    expect(spy).toHaveBeenCalled()
  })

  test('Should return unauthorizedError if no user is found and not next', async () => {
    const spy = vi.fn()
    const reqWithouToken = { ...req, cookies: { JWT: '' } } as unknown as Request
    await expect(authMiddleware(reqWithouToken, res, () => {
      spy()
    })).rejects.toThrow(UnautorizedError)
    expect(spy).toBeCalledTimes(0)
  })
})
