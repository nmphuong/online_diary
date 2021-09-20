import { FOError } from '../modules/error'
import logger from '../utils/logger'
import * as _ from 'lodash'
import { ErrorCode } from '../models/enum'

export const handlingError = (err, req, res, next) => {
  let errors: any = undefined
  if (err.hasOwnProperty('array')) {
    if (err.array()[0].param === '_error') {
      errors = err.array()[0].nestedErrors
    } else {
      errors = err.array()
    }
  }
  // Handle express-validator error
  const caught = (errors) ? new FOError(400, errors.map(item => ({
    code: ErrorCode.INVALID_PARAMETER,
    message: item.msg,
    parameter: item.param
  }))) : customizeMessage(new FOError(err))
  logger.error(JSON.stringify(caught))
  if (process.env.NODE_ENV !== 'production') {
  }
  if (!caught.code) {
    caught.code = 500
  }
  res.status(caught.code).json(caught)
}

const customizeMessage = (err: FOError) => {
  err.errors = err.errors.map((error) => {
    if (error.message) {
      for (const key in error.custom) {
        const replaceKey = new RegExp(`\{\{${key}\}\}`, 'g')
        error.message = error.message!.replace(replaceKey, error.custom[key])
      }
    }
    return _.pick(error, ['code', 'message', 'parameter', 'log'])
  })
  return err
}
