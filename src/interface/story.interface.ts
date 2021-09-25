import { Document, Model, Schema } from 'mongoose'

export interface IBaseStory {
    userId: string
    content: string
}

export interface IStoryModel extends IBaseStory, Document { }
