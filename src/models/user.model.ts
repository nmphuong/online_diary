import * as mongoosePaginate from 'mongoose-paginate'
import * as mongooseTimestamp from 'mongoose-timestamp'
import * as mongooseBcrypt from 'mongoose-bcrypt'
import * as mongooseDelete from 'mongoose-delete'
import { Schema, model } from 'mongoose'
import { getEnumValues, getRegExRule, getError } from '../utils'
import { GENDER } from "./enum";

export const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: getRegExRule('email')
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
        rounds: 9
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: getEnumValues(GENDER)
    },
    bod: {
        type: String
    }
})

userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseTimestamp)
userSchema.plugin(mongooseBcrypt)
userSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
})

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ phone: 1 }, { unique: true })

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.post('save', async (err, doc, next) => {
    next(getError(err))
})

userSchema.post('findOneAndUpdate', (err, doc, next) => {
    next(getError(err))
})

/* tslint:disable */
export const User = model('User', userSchema)
/* tslint:enable */