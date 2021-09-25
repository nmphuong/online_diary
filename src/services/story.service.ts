import { verify } from '../modules/jwt'
import { FOError } from '../modules/error'
import { ErrorCode } from '../models/enum'
import { Document } from 'mongoose'
import { User } from 'models/user.model'

namespace StoryService {

    export const create = async (
        model,
        data,
        reqUser,
        parsedData
    ) => {
        if (!data.content) {
            throw new FOError(400, ErrorCode.BAD_REQUEST, 'Invalid params')
        }
        const role = model.modelName.toLowerCase()
        data.userId = reqUser?.id
        await data.save()
        return {
            [role]: data
        }
    }
}
export = StoryService