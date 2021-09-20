import { issueTokens } from '../modules/jwt'
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
        delete params.password
        const tokens = await issueTokens(model as any, doc.id, { role, id: doc.id})
        return {
            [role]: doc,
            token: tokens.accessToken
        }
    }
}
export = AuthService