import { User } from '../models/index.js'
import { apiResponseService } from '../services/index.js'

export const getAllUsers = async ctx => {
  try {
    const users = await User.find({})

    return apiResponseService.sendSuccess(ctx, 'OK', users)
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}
