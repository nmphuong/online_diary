import * as mongoosePaginate from 'mongoose-paginate'
import * as mongooseTimestamp from 'mongoose-timestamp'
import { PaginateModel, Document, Schema, model } from 'mongoose'
import { IRefreshTokenModel } from '../interface/refresh-token.interface'
import { getEnumValues } from '../utils'
import { ACCOUNT_TYPE } from './enum'

export const refreshTokenSchema = new Schema({
  accountId: {
    type: String
  },
  accountType: {
    type: String,
    enum: getEnumValues(ACCOUNT_TYPE)
  },
  token: {
    type: String
  }
})

refreshTokenSchema.index({ token: 1 })
refreshTokenSchema.index({ accountId: 1, accountType: 1 })
refreshTokenSchema.index({ createdAt: 1 })
refreshTokenSchema.index({ updatedAt: 1 })

refreshTokenSchema.plugin(mongoosePaginate)
refreshTokenSchema.plugin(mongooseTimestamp)

interface RefreshTokenModel<T extends Document> extends PaginateModel<T> { }
/* tslint:disable */
export const RefreshToken: RefreshTokenModel<IRefreshTokenModel> = model<IRefreshTokenModel>('RefreshToken', refreshTokenSchema)
/* tslint:enable */
