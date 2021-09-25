import { verify } from '../modules/jwt'
import { Request, Response, NextFunction } from 'express'
import { FOError } from '../modules/error'
import { ErrorCode } from '../models/enum'
import config from '../config'

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const token = <string>req.headers['authorization']
  const apiKeyConfig = config.apiKey
  const apiKey = <string>req.headers[apiKeyConfig.name] ? (<string>req.headers[apiKeyConfig.name]).split(apiKeyConfig.dedicatedSplit) : ''

  try {
    if (token) {
      req.user = {}
      const decoded = verify(token)
      Object.assign(req.user, decoded)
    } else if (apiKey && apiKeyConfig.keys.includes(apiKey[1])) {
      req.user = {
        role: apiKey[0]
      }
    }
    next()
  } catch (err) {
    next(new FOError(401, ErrorCode.AUTHENTICATION_ERROR, err.message))
  }
}
