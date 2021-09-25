import * as morgan from 'morgan'

morgan.token('actor-role', (req: any) => req.user ? req.user.role : '')
morgan.token('actor-id', (req: any) => req.user ? req.user.id : '')
morgan.token('body', (req: any) => req.body)
morgan.token('user-ip', (req: any) => req.userIp)

const jsonFormat = (tokens, req, res) => {
  const body = tokens['body'](req, res)
  if (body.password) {
    delete body.password
  }

  return JSON.stringify({
    remoteAddress: tokens['remote-addr'](req, res),
    userIp: tokens['user-ip'](req, res),
    time: tokens['date'](req, res, 'iso'),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    statusCode: tokens['status'](req, res),
    contentLength: tokens['res'](req, res, 'content-length'),
    responseTime: tokens['response-time'](req, res),
    actorRole: tokens['actor-role'](req, res),
    actorId: tokens['actor-id'](req, res),
    body
  })
}

export function loggerMiddleware() {
  return morgan(jsonFormat)
}
