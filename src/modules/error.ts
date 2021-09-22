import * as _ from 'lodash'
import { ErrorCode } from '../models/enum'

/**
 * @typedef SubError
 * @property {string} code
 * @property {string} message
 * @property {string} parameter
 */
/**
 * @typedef Error
 * @property {integer} statusCode
 * @property {Array.<SubError>} errors
 */

namespace ErrorLib {

  export interface ISubError {
    code: ErrorCode,
    message?: string,
    parameter?: string,
    log?: string,
    custom?: object
  }
  export class FOError extends Error {
    public code: number
    public errors: ISubError[]
    public stack: string
    public payload: any

    constructor(
      statusCode: number,
      code: ErrorCode,
      message?: string,
      parameter?: string,
      log?: string,
      stack?: string,
      payload?: any
    )
    constructor(
      statusCode: number,
      code: ErrorCode,
      message?: string,
      parameter?: string,
      log?: string,
      custom?: object
    )
    constructor(
      error: any
    )
    constructor(
      ...args: any[]
    ) {
      super()
      this.code = 500
      this.errors = []

      if (typeof args[0] === 'number') {
        this.code = args[0]
        if (typeof args[1] === 'string' && args[4]) {
          const [code, message, parameter, displayMessage] = args.slice(1, 5)
          let custom = {}
          if (args[5] && typeof args[5] === 'object') custom = args[5]
          this.errors = <ISubError[]>[_.omitBy({
            code,
            message: displayMessage,
            parameter,
            log: message,
            custom
          }, _.isUndefined)]
        } else if (typeof args[1] === 'string') {
          const [code, message, parameter] = args.slice(1, 4)
          this.errors = <ISubError[]>[_.omitBy({ code, message, parameter }, _.isUndefined)]
        } else {
          this.errors = <ISubError[]>_.flatten([args[1]]).map((e: any) => _.omitBy(e, _.isUndefined))
        }

        if (typeof args[1] === 'string' && args[6]) {
          this.payload = args[6]
        } else if (typeof args[1] !== 'string' && args[2]) {
          this.payload = args[2]
        }
      } else {
        this.code = 500
        this.errors = [{
          code: ErrorCode.INTERNAL_ERROR,
          message: 'unsupported error'
        }]
        this.payload = args[0].payload
        if (typeof args[0] === 'object') {
          if (isErrorObj(args[0])) {
            this.code = args[0].code
            this.errors = args[0].errors
          } else if (args[0] instanceof Error) {
            const e: Error = args[0]
            this.errors[0].message = e.message
          }
        }
      }
    }
  }

  function isErrorObj(obj: any): boolean {
    return (
      _.isNumber(obj.code) &&
      _.isArray(obj.errors) &&
      !_.isEmpty(obj.errors) &&
      _.every(obj.errors, (error: any) => _.isString(error.code))
    )
  }
}

export = ErrorLib
