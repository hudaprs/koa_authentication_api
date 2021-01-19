import { Token, User } from '../models/index.js'
import { apiResponseService, tokenService } from '../services/index.js'
import bcrypt from 'bcryptjs'

/**
 * @description Register
 *
 * @method POST
 * @url api/auth
 *
 * @return JSON
 */
export const register = async ctx => {
  try {
    const { name, email, password } = ctx.request.body

    if (!name || !email || !password) {
      ctx.status = 422
      throw new Error('Please fill name, email and password')
    }

    let user = await User.findOne({
      email: email.toLowerCase().replace(' ', '', '/s+/')
    })

    if (user) {
      ctx.status = 422
      throw new Error('User already registered')
    }

    user = new User({
      name,
      email
    })

    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword

    await user.save()

    delete user.password

    ctx.status = 201
    return apiResponseService.sendSuccess(ctx, 'User successfully registered', {
      ...user._doc,
      password: undefined
    })
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}

/**
 * @description
 *
 * @method POST
 * @url api/auth
 *
 * @return JSON
 */
export const login = async ctx => {
  let invalidCredentialsMessage = 'Invalid credentials'
  try {
    let { email, password } = ctx.request.body
    ctx.status = 422

    if (!email || !password) throw new Error(invalidCredentialsMessage)

    let user = await User.findOne({
      email: email.toLowerCase().replace(' ', '', '/s+/')
    })
    if (!user) throw new Error(invalidCredentialsMessage)

    let checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) throw new Error(invalidCredentialsMessage)

    // Generate token
    const { token, refreshToken } = await tokenService.generateToken(ctx, {
      user: user._id
    })

    ctx.status = 200
    return apiResponseService.sendSuccess(ctx, 'Login success', {
      token,
      refreshToken,
      user: {
        ...user._doc,
        password: undefined
      }
    })
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}

export const logout = async ctx => {
  try {
    let token = await Token.findOne({ user: ctx.user })
    if (!token) {
      ctx.status = 404
      throw new Error('Token not recognized')
    }

    await Token.findByIdAndRemove(token._id)

    return apiResponseService.sendSuccess(ctx, 'Token removed')
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}
