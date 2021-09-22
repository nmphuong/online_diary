import * as mongoose from 'mongoose'
import logger from '../utils/logger'

namespace DatabaseLib {
  export interface IDBConfig {
    uri: string
  }

  let config: IDBConfig

  export const configure = (param: IDBConfig) => {
    config = param
  }

  export const initDb = () => {

    const connectOption = {
      poolSize: 10,
      reconnectTries: 60,
      reconnectInterval: 1000,
      autoIndex: process.env.NODE_ENV === 'production' ? false : true
    }

    mongoose.connect(config.uri, connectOption).catch(() => {
      logger.error(` Failed to connect mongo at ${config.uri}`)
    })

    mongoose.connection.once('open', () => {
      logger.info('open connection')
    })

    mongoose.connection.once('error', (error) => {
      logger.error(`error connection ${error}`)
    })
  }

}

export = DatabaseLib
