export const sendSuccess = (ctx, message, results = null, options = {}) => {
  ctx.status = ctx.status
  return (ctx.body = {
    message,
    results,
    ...options
  })
}

export const sendError = (ctx, err, options = {}) => {
  const { message, stack } = err

  ctx.status = ctx.status

  if (
    err.message === 'jwt malformed' ||
    err.message === 'jwt invalid' ||
    'invalid signature'
  )
    ctx.status = 401

  return (ctx.body = {
    message,
    stack,
    ...options
  })
}
