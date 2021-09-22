import * as jwt from 'jsonwebtoken'
import * as randToken from 'rand-token'
import * as moment from 'moment'
import { Model } from 'mongoose'
import { FOError } from '../modules/error'
import { ErrorCode } from '../models/enum'
import { RefreshToken } from '../models/refresh-token.model'
import conf from '../config/index'

namespace JWTLib {

  export type AccessToken = string
  export type RefreshToken = string

  interface IJWTTokenExpiresIns {
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number
  }

  export interface IJWTConfig {
    secret: string,
    public: string,
    algorithm: jwt.Algorithm,
    user: IJWTTokenExpiresIns,
    // agent: IJWTTokenExpiresIns
  }

  export interface IJWTPayload {
    id: string,
    role: string
  }

  export interface IJWTTokens {
    accessToken: AccessToken,
    refreshToken: RefreshToken
  }

  let config: IJWTConfig
  export const configure = (
    param: IJWTConfig
  ): void => {
    config = param
  }

  const issueAccessToken = (
    accountType: string,
    payload: IJWTPayload
  ): AccessToken => {
    return jwt.sign(payload, conf.jwtConfig.secret, { algorithm: conf.jwtConfig.algorithm, expiresIn: conf.jwtConfig[accountType.toLowerCase()].accessTokenExpiresIn })
  } 

  const issueRefreshToken = async <T extends Model<any>>(
    model: T,
    id: string
  ): Promise<RefreshToken> => {
    await revoke(model, id)
    const token = randToken.uid(256)
    const refreshToken = new RefreshToken({
      token,
      accountId: id,
      accountType: model.modelName.toUpperCase()
    })
    await refreshToken.save()
    return refreshToken.token
  }

  export const issueTokens = async <T extends Model<any>>(
    model: T,
    id: string,
    payload: IJWTPayload
  ): Promise<IJWTTokens> => {
    return {
      accessToken: issueAccessToken(model.modelName, payload),
      refreshToken: await issueRefreshToken(model, id)
    }
  }

  export const refresh = async <T extends Model<any>>(
    model: T,
    id: string,
    payload: IJWTPayload,
    refreshToken: RefreshToken
  ): Promise<IJWTTokens> => {
    const token = await RefreshToken.findOne({ token: refreshToken })
    if (!token) {
      throw new FOError(401,
        ErrorCode.AUTHENTICATION_ERROR,
        'refresh token has been expired')
    }
    if (moment().diff(token.createdAt, 'second') > config[model.modelName.toLowerCase()].refreshTokenExpiresIn) {
      throw new FOError(401,
        ErrorCode.AUTHENTICATION_ERROR,
        'refresh token has been expired')
    }
    return issueTokens(model, id, payload)
  }

  export const revoke = async <T extends Model<any>>(
    model: T,
    id: string
  ) => {
    await RefreshToken.deleteMany({
      accountId: id,
      accountType: model.modelName.toUpperCase()
    })
  }

  export const verify = (
    accessToken: AccessToken
  ): object => {
    const decoded = <any>jwt.verify(accessToken, conf.jwtConfig.public, { algorithms: [conf.jwtConfig.algorithm] })
    delete decoded.iat
    // delete decoded.exp
    return decoded
  }

  export const decode = (
    accessToken: AccessToken
  ): object => {
    const decoded = <any>jwt.decode(accessToken)
    return decoded
  }
}

export = JWTLib
