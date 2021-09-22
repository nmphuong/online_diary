import { Document, Model, Schema } from 'mongoose'

export interface IBaseUser {
  firstName: string
  lastName: string
  email: string
  phone: string
  bod: string,
  password?: string
  emailVerified: boolean
  verifyPassword: (password: string) => Promise<boolean>
}

export interface IUserModel extends IBaseUser, Document { }
