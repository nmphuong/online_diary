import * as requestIp from 'request-ip'
import * as DeviceDetector from 'device-detector-js'
import { NextFunction, Request, Response } from 'express'

const deviceDetector = new DeviceDetector()

export const parseRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = <string>req.headers['user']
  req.parsedData = {
    userIp: requestIp.getClientIp(req),
    originUserAgent: user,
    user: deviceDetector.parse(user)
  }
  next()
}
