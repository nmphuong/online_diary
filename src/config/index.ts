import { IDBConfig } from '../modules/db'
import { IJWTConfig } from '../modules/jwt'
import { TIMESTAMP_CONSTANT } from '../models/constant'
import { Algorithm } from 'jsonwebtoken'
import { LANGUAGES } from '../models/enum'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

class Config {
    env: string
    port: number
    databaseConfig: IDBConfig
    jwtConfig: IJWTConfig
    defaultLanguage: LANGUAGES

    constructor() {
        this.env = process.env.NODE_ENV || 'local'
        this.port = Number(process.env.PORT) || 8080
        this.databaseConfig = {
            uri: process.env.MONGODB_URI || ''
        }
        this.jwtConfig = {
            secret: process.env.SECRET_JWT || '',
            public: process.env.PUBLIC_JWT || '',
            algorithm: <Algorithm>process.env.ALGORITHM_JWT || '',
            user: {
                accessTokenExpiresIn: Number(process.env.USER_ACCESS_TOKEN_EXPIRES_IN) || TIMESTAMP_CONSTANT.SECONDS_PER_DAY * 7,
                refreshTokenExpiresIn: Number(process.env.USER_REFRESH_TOKEN_EXPIRES_IN) || TIMESTAMP_CONSTANT.SECONDS_PER_DAY * 7
            },
            // agent: {
            //     accessTokenExpiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || TIMESTAMP_CONSTANT.SECONDS_PER_30_DAYS,
            //     refreshTokenExpiresIn: Number(process.env.USER_REFRESH_TOKEN_EXPIRES_IN) || TIMESTAMP_CONSTANT.SECONDS_PER_30_DAYS
            // }
        }
        this.defaultLanguage = LANGUAGES.VIE
    }
}

export default new Config()