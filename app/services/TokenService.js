import jwt from 'jsonwebtoken'
import { Token } from '../models/index.js'
import { apiResponseService } from './index.js'

export const generateToken = async (ctx, tokenPayload) => {
  try {
    const commonToken = jwt.sign(tokenPayload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: '15s'
    })
    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.JWT_REFRESH_TOKEN_SECRET
    )

    // Remove previous token
    let token = await Token.findOne({
      user: tokenPayload.user
    })
    if (token) {
      await Token.findByIdAndRemove(token._id)
    }

    token = await Token.create({
      user: tokenPayload.user,
      refreshToken
    })

    return {
      token: commonToken,
      refreshToken
    }
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}
