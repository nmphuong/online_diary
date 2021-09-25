import { FOError } from '../modules/error'
import { ErrorCode } from '../models/enum'

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

    export const getStory = async (
        model,
        reqUser,
        page: number | undefined = 1,
        limit: number | undefined = 30,
        parsedData
    ) => {
        const query = { userId: reqUser.id }
        const doc = await model.paginate(query, {
            page,
            limit
        })
        if (!doc) {
            throw new FOError(404, ErrorCode.NOT_FOUND, 'No data')
        }
        return doc
    }
}
export = StoryService