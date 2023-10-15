import { Router } from 'express'
import { validate } from '../middlewares'
import { AuthenticationController } from '../controllers'
import {
  SignUpDto,
  VerifyEmailDto,
  ResendEmailDto,
  SignInDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  DeleteAccountDto
} from '../models'

const router = Router()

const PATH = {
  SIGN_UP: '/sign-up',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION_EMAIL: '/resend-verification-email',
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  DELETE_ACCOUNT: '/delete-account',
  VERIFY_TOKEN: '/verify-token',
  REFRESH_TOKEN: '/refresh-token',
}

// POST APIs
router.post(PATH.SIGN_UP, validate(SignUpDto), AuthenticationController.SIGN_UP)
router.post(PATH.VERIFY_EMAIL, validate(VerifyEmailDto), AuthenticationController.VERIFY_EMAIL)
router.post(PATH.RESEND_VERIFICATION_EMAIL, validate(ResendEmailDto), AuthenticationController.RESEND_VERIFICATION_EMAIL)
router.post(PATH.SIGN_IN, validate(SignInDto), AuthenticationController.SIGN_IN)
router.post(PATH.SIGN_OUT, AuthenticationController.SIGN_OUT)
router.post(PATH.FORGOT_PASSWORD, validate(ForgotPasswordDto), AuthenticationController.FORGOT_PASSWORD)
router.post(PATH.RESET_PASSWORD, validate(ResetPasswordDto), AuthenticationController.RESET_PASSWORD)
router.post(PATH.CHANGE_PASSWORD, validate(ChangePasswordDto), AuthenticationController.CHANGE_PASSWORD)
router.post(PATH.DELETE_ACCOUNT, validate(DeleteAccountDto), AuthenticationController.DELETE_ACCOUNT)
router.post(PATH.VERIFY_TOKEN, AuthenticationController.VERIFY_TOKEN)
router.post(PATH.REFRESH_TOKEN, AuthenticationController.REFRESH_TOKEN)

export const AUTH_PATH = '/authentication';
export const AUTH_ROUTER = router;