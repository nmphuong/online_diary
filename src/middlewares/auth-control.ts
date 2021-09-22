import { Request } from 'express'

// User
export const isMyRequest = (req: Request): boolean => {
  return req.user.id === req.params.id || req.user.id === req.query.userId
}
