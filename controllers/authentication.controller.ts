import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import db from '../prisma'
import { User } from '@prisma/client'
import { ChangePasswordDto, DeleteAccountDto, ForgotPasswordDto, ResendEmailDto, ResetPasswordDto, SignInDto, SignUpDto, VerifyEmailDto } from '../models'
import { ERROR_MESSAGE } from '../constants'
import { IAuthenticationCookies } from '../response'
import { SEND_VERIFICATION_EMAIL, SEND_FORGOT_PASSWORD_EMAIL } from '../utilities';

const secretKey = process.env.SECRET_KEY || ''
const refreshSecretKey = process.env.REFRESH_SECRET_KEY || ''

export namespace AuthenticationController {

  // generate random number up to 9999
  const generateRandomNumber = (length: number = 4): string => {
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const characters = '0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }

    return result
  }

  // sign up user
  export const SIGN_UP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const obj = req.body as SignUpDto

      // Check if user already exists
      const dbUser = await db.user.findUnique({ where: { email: obj.email } })
      if (dbUser) throw createError[409](ERROR_MESSAGE.USER_ALREADY_EXISTS)

      let user = {
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        password: obj.password,
        terms_accepted: obj.terms_accepted
      } as User

      // Hash password
      user.password = await bcrypt.hash(user.password, 10)

      // Create user in database
      user = await db.user.create({ data: { ...user, email_verify_code: generateRandomNumber() } }) as User

      // Send verification email
      SEND_VERIFICATION_EMAIL(obj.redirect_url, user.email, user.email_verify_code)

      // Payload for JWT token generation and verification
      const payload = { user_id: user.user_id, user: { first_name: user.first_name, last_name: user.last_name, email: user.email } }

      // Generate access token
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: '15m' })

      // Generate refresh token
      const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' })

      // Set tokens in cookies
      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })

      res.status(201).json({ accessToken, refreshToken })

    } catch (error) {
      next(error)
    }
  }

  // verify email
  export const VERIFY_EMAIL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, email_verify_code } = req.body as VerifyEmailDto

      // Check if user exists
      const user = await db.user.findUnique({ where: { email } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if verification code is correct
      if (user.email_verify_code !== email_verify_code) throw createError[400](ERROR_MESSAGE.INVALID_EMAIL_VERIFY_CODE)

      // Check if user already verified
      if (user.is_email_verified) throw createError[400](ERROR_MESSAGE.EMAIL_ALREADY_VERIFIED)

      // Update user
      await db.user.update({ where: { user_id: user.user_id }, data: { is_email_verified: true } })

      res.status(200).json({ message: 'Email verified.' })
    } catch (error) {
      next(error)
    }
  }

  // resend verification email
  export const RESEND_VERIFICATION_EMAIL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, redirect_url } = req.body as ResendEmailDto
      const user = await db.user.findUnique({ where: { email } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if user already verified
      if (user.is_email_verified) throw createError[400](ERROR_MESSAGE.EMAIL_ALREADY_VERIFIED)

      // Generate reset password code
      const email_verify_code = generateRandomNumber()
      await db.user.update({ where: { user_id: user.user_id }, data: { email_verify_code, is_email_verified: false } })

      // Send verification email
      SEND_VERIFICATION_EMAIL(redirect_url, user.email, email_verify_code)

      res.status(200).json({ message: 'Verification code sent.' })
    } catch (error) {
      next(error)
    }
  }

  // sign in user
  export const SIGN_IN = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { email, password } = req.body as SignInDto

      // Find user by email
      const user = await db.user.findUnique({ where: { email } })

      // Check if user exists
      if (!user) throw createError[404](ERROR_MESSAGE.INVALID_CREDENTIALS)

      // Check if user is active
      if (!user.is_active) throw createError[401](ERROR_MESSAGE.USER_NOT_ACTIVE)

      // Check if user is deleted
      if (user.is_deleted) throw createError[401](ERROR_MESSAGE.USER_DELETED)

      // Check if user is blocked
      if (user.login_attempts >= 3) throw createError[401](ERROR_MESSAGE.USER_BLOCKED)

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        await db.user.update({ where: { user_id: user.user_id }, data: { login_attempts: user.login_attempts + 1 } })
        throw createError[401](ERROR_MESSAGE.INVALID_CREDENTIALS)
      }

      // Reset login attempts
      await db.user.update({ where: { user_id: user.user_id }, data: { login_attempts: 0 } })

      // Return user
      const payload = { user_id: user.user_id, user: { first_name: user.first_name, last_name: user.last_name, email: user.email } }

      // Generate access token
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: '15m' })

      // Generate refresh token
      const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' })

      // Set tokens in cookies
      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })

      res.status(200).json({accessToken, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  // sign out user
  export const SIGN_OUT = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.json({ message: 'User signed out' })
    } catch (error) {
      next(error)
    }
  }

  // forgot password
  export const FORGOT_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, redirect_url } = req.body as ForgotPasswordDto
      const user = await db.user.findUnique({ where: { email } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if user is active
      if (!user.is_active) throw createError[401](ERROR_MESSAGE.USER_NOT_ACTIVE)

      // Check if user is deleted
      if (user.is_deleted) throw createError[401](ERROR_MESSAGE.USER_DELETED)

      // Generate reset password code
      const reset_password_code = generateRandomNumber()
      await db.user.update({ where: { user_id: user.user_id }, data: { reset_password_code } })

      // Send reset password email
      SEND_FORGOT_PASSWORD_EMAIL(redirect_url, user.email, reset_password_code)

      res.status(200).json({ message: 'Verification code sent.' })

    } catch (error) {
      next(error)
    }
  }

  // reset password
  export const RESET_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, reset_password_code } = req.body as ResetPasswordDto

      // Check if user exists
      const user = await db.user.findUnique({ where: { email } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if reset password code is correct
      if (user.reset_password_code !== reset_password_code) throw createError[400](ERROR_MESSAGE.INVALID_RESET_PASSWORD_CODE)

      // update password
      await db.user.update({ where: { user_id: user.user_id }, data: { password: await bcrypt.hash(password, 10), reset_password_code: null } })

      res.status(200).json({ message: 'Password updated.' })
    } catch (error) {
      next(error)
    }
  }

  // change password
  export const CHANGE_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
    try {

      // Get user user_id from cookies
      if (!req.cookies.accessToken) throw createError[401](ERROR_MESSAGE.INVALID_CREDENTIALS)
      const user_id = (jwt.decode(req.cookies.accessToken) as IAuthenticationCookies).user_id

      const { old_password, new_password } = req.body as ChangePasswordDto

      // Check if user exists
      const user = await db.user.findUnique({ where: { user_id } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if old password is correct
      const isMatch = await bcrypt.compare(old_password, user.password)
      if (!isMatch) throw createError[401](ERROR_MESSAGE.INVALID_CREDENTIALS)

      // update password
      await db.user.update({ where: { user_id: user.user_id }, data: { password: await bcrypt.hash(new_password, 10) } })

      res.status(200).json({ message: 'Password updated.' })
    } catch (error) {
      next(error)
    }
  }

  // delete account
  export const DELETE_ACCOUNT = async (req: Request, res: Response, next: NextFunction) => {
    try {

      // Get user user_id from cookies
      if (!req.cookies.accessToken) throw createError[401](ERROR_MESSAGE.INVALID_CREDENTIALS)
      const user_id = (jwt.decode(req.cookies.accessToken) as IAuthenticationCookies).user_id

      const { password } = req.body as DeleteAccountDto

      // Check if user exists
      const user = await db.user.findUnique({ where: { user_id } })
      if (!user) throw createError[404](ERROR_MESSAGE.USER_NOT_FOUND)

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw createError[401](ERROR_MESSAGE.INVALID_CREDENTIALS)

      // delete user
      await db.user.update({ where: { user_id: user.user_id }, data: { is_active: false, is_deleted: true } })

      // Clear cookies and send response
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({ message: 'Account deleted.' })
    } catch (error) {
      next(error)
    }
  }

  // verify token
  export const VERIFY_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken

      if (!accessToken) {
        return res.status(401).json({ error: 'Access token not found in cookies' })
      }

      jwt.verify(accessToken, secretKey, (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid access token' })
        }
        res.json(decoded)
      })
    } catch (error) {
      next(error)
    }
  }

  // Refresh access token using refresh token
  export const REFRESH_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found in cookies' })
    }

    jwt.verify(refreshToken, refreshSecretKey, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }

      // Generate a new access token
      const payload = { user_id: decoded.user_id, user: { first_name: decoded.user.first_name, last_name: decoded.user.last_name, email: decoded.user.email } }
      const newAccessToken = jwt.sign(payload, secretKey, { expiresIn: '15m' })

      // Set the new access token in the cookie
      res.cookie('accessToken', newAccessToken, { httpOnly: true })
      res.json({ message: 'Access token refreshed' })
    })
  }
}