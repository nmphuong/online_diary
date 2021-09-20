import { NextFunction, Request, Response } from 'express'
import { ErrorCode } from '../models/enum'
import { FOError } from '../modules/error'
import * as async from 'async'
import logger from '../utils/logger'

let options = {
  decodedObjectName: 'user',
  defaultRole: 'guest',
  denyCallback: (res: Response, next: NextFunction) => {
    return next(new FOError(403, ErrorCode.FORBIDDEN, 'not authorized'))
  }
}

export function config(config) {
  options = Object.assign(options, config)
}

export function allow(
  roles?: string | string[],
  conditions?: { role: string, predicate: (req: Request) => Promise<boolean> }[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req[options.decodedObjectName]) {
      req[options.decodedObjectName] = {
        role: options.defaultRole
      }
    }
    const role = req[options.decodedObjectName].role || options.defaultRole
    if (roles) {
      const allowRoles = (typeof roles === 'string') ? [roles] : roles
      if (allowRoles[0] === '*') {
        return next()
      }
      if (allowRoles && allowRoles.indexOf(role) >= 0) {
        return next()
      }
    }
    if (!conditions) {
      return options.denyCallback(res, next)
    }
    async.some(conditions, async (cond) => {
      if (role === cond.role && cond.predicate) {
        return await cond.predicate(req).catch((error) => {
          const err = error instanceof FOError ? error : {
            errName: error.name,
            errMsg: error.message,
            ...(error.stack && { errStack: error.stack })
          }
          logger.error(`[ACL:${role}] ${JSON.stringify(err)}`)
          return false
        })
      }
      return false
    }, (err, result) => {
      if (err) {
        return next(err)
      }
      if (!result) {
        options.denyCallback(res, next)
      } else {
        next()
      }
    })
  }
}
