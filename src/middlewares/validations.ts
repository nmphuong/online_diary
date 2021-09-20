import { check, oneOf, ValidationChain } from 'express-validator'
import * as _ from 'lodash'

const minMax = {
    email: [10, 50],
    phone: [9, 12],
    password: [8, 20]
}

function checkBase(
    type: string,
    field: string,
    minMax: number[] | undefined = undefined
  ): ValidationChain {
    const baseCheck = check(field)
    if (!minMax) {
      return baseCheck
    }
    const typeCheckFunc = `is${type === 'String' ? 'Length' : type}`
    return baseCheck
    [typeCheckFunc]({ min: minMax[0] })
      .withMessage(`${field} is too ${type === 'String' ? 'short' : 'small'}`)
    [typeCheckFunc]({ max: minMax[1] })
      .withMessage(`${field} is too ${type === 'String' ? 'long' : 'big'}`)
  }

function checkString (
    field: string,
    minMax: number[] | undefined = undefined
) : ValidationChain {
    return checkBase('String', field, minMax)
}

export const checkAuthUserRegister = [
    check('email').isEmail().exists(),
    checkString('password', minMax.password).exists()
]

export const checkAuthUserLogin = [
    checkString('email', minMax.email).exists(),
    checkString('password', minMax.password).exists()
]