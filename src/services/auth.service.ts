import { issueTokens, verify } from '../modules/jwt'
import { FOError } from '../modules/error'
import { ErrorCode } from '../models/enum'

namespace AuthService {
    export const register = async (
        model,
        doc,
        parsedData
    ) => {
        const role = model.modelName.toLowerCase()
        await doc.save()
        return {
            [role]: doc
        }
    }

    export const login = async (
        model,
        params,
        parsedData
    ) => {
        const role = model.modelName.toLowerCase()
        const query = { email: params.email }
        const doc = await model.findOne(query)
        if (!doc) {
            throw new FOError(404, ErrorCode.NOT_FOUND, `${role} not found`)
        }
        const valid = await doc.verifyPassword(params.password)
        if (!valid) {
            throw new FOError(401, ErrorCode.AUTHENTICATION_ERROR, 'authentication failed')
        }
        params.password = undefined
        const tokens = await issueTokens(model as any, doc.id, { role, id: doc.id})
        return {
            [role]: doc,
            token: tokens.accessToken
        }
    }

    export const info = async (
        model,
        token,
        parsedData
    ) => {

        const access:any = await verify(token)

        if (!access) {
            throw new FOError(401, ErrorCode.AUTHENTICATION_ERROR, 'authentication failed')
        }

        const query = { _id: access?.id }
        const doc = await model.findOne(query)

        doc.password = undefined

        return doc
    }
}
export = AuthService