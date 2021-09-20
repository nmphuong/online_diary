import { Document } from 'mongoose'

export interface IRefreshToken {
  accountId: string
  accoutType: string
  token: string
  createdAt: Date
}

export interface IRefreshTokenModel extends IRefreshToken, Document { }
