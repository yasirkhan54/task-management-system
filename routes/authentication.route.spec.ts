import request from 'supertest'
import app from '../src/index'
import { AUTH_PATH } from './authentication.route'

describe('Authentication API', () => {
  describe('SIGN_UP', () => {
    it('should create a new user', async () => {
     // TODO: Implement test case
    })

    it('should return an error for an invalid email', async () => {
      // TODO: Implement test case
    })

    afterAll(async () => {
      // TODO: Implement test case
    })
  })

  describe('VERIFY_EMAIL', () => {
    it('should verify a user email', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid token', async () => {
      // TODO: Implement test case
    })
  })

  describe('RESEND_VERIFICATION_EMAIL', () => {
    it('should resend a verification email', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid email', async () => {
      // TODO: Implement test case
    })
  })

  describe('SIGN_IN', () => {
    it('should sign in a user', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid email', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an incorrect password', async () => {
      // TODO: Implement test case
    })
  })

  describe('SIGN_OUT', () => {
    it('should sign out a user', async () => {
      // TODO: Implement test case
    })
  })

  describe('FORGOT_PASSWORD', () => {
    it('should send a forgot password email', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid email', async () => {
      // TODO: Implement test case
    })
  })

  describe('RESET_PASSWORD', () => {
    it('should reset a user password', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid token', async () => {
      // TODO: Implement test case
    })

    it('should return an error for a password mismatch', async () => {
      // TODO: Implement test case
    })
  })

  describe('CHANGE_PASSWORD', () => {
    it('should change a user password', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an incorrect current password', async () => {
      // TODO: Implement test case
    })

    it('should return an error for a password mismatch', async () => {
      // TODO: Implement test case
    })
  })

  describe('DELETE_ACCOUNT', () => {
    it('should delete a user account', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an incorrect password', async () => {
      // TODO: Implement test case
    })
  })

  describe('VERIFY_TOKEN', () => {
    it('should verify an access token', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid token', async () => {
      // TODO: Implement test case
    })
  })

  describe('REFRESH_TOKEN', () => {
    it('should refresh an access token', async () => {
      // TODO: Implement test case
    })

    it('should return an error for an invalid refresh token', async () => {
      // TODO: Implement test case
    })
  })
})