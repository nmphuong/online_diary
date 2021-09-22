import { ErrorCode, LANGUAGES } from '../models/enum'
import { FOError } from '../modules/error'

export const getRegExRule: any = function (type: string) {
  switch (type) {
    case 'email':
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    case 'url':
      return /[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    case 'date':
      // yyyy-mm-dd
      return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
  }
}

export const getEnumValues = (enumerator: Object) => {
  if (!enumerator) {
    return []
  }
  return Object.keys(enumerator).filter(key => isNaN(Number(key))).map(key => enumerator[key])
}

export const getError = (err) => {
  if (err.message.includes('E11000')) {
    if (err.message.includes('phone')) {
      return new FOError(409, ErrorCode.DUPLICATE, 'this phone number is already in use', 'phone')
    }
    if (err.message.includes('email')) {
      return new FOError(409, ErrorCode.DUPLICATE, 'this email address is already in use', 'email')
    }
    return new FOError(409, ErrorCode.DUPLICATE, 'duplicate key entry')
  }
  return new FOError(400, ErrorCode.INVALID_PARAMETER, err.message)
}