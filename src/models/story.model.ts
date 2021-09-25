import * as mongoosePaginate from 'mongoose-paginate'
import * as mongooseTimestamp from 'mongoose-timestamp'
import * as mongooseBcrypt from 'mongoose-bcrypt'
import * as mongooseDelete from 'mongoose-delete'
import { Document, Schema, model, PaginateModel } from 'mongoose'
import { IStoryModel } from '../interface/story.interface'
import { getError } from '../utils'

export const storySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
})

storySchema.plugin(mongoosePaginate)
storySchema.plugin(mongooseTimestamp)
storySchema.plugin(mongooseBcrypt)
storySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
})

storySchema.post('save', async (err, doc, next) => {
    next(getError(err))
})

storySchema.post('findOneAndUpdate', (err, doc, next) => {
    next(getError(err))
})

export interface StoryModel<T extends Document> extends PaginateModel<T> { }
/* tslint:disable */
export const Story: StoryModel<IStoryModel> = model<IStoryModel>('Story', storySchema)
/* tslint:enable */