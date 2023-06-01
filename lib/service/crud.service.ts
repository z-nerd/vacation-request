import {
    MongoClient,
    Db,
    Document,
    IndexSpecification,
    CreateIndexesOptions,
    FindOptions,
    Filter,
    InsertOneOptions,
    DeleteOptions,
    UpdateOptions,
    UpdateFilter,
} from "mongodb"
import clientPromise from "../mongodb"
import { TRequireOne } from "@/sdk/utility"
import { AppError } from "../error"


export class CrudService {
    db!: Db
    client!: MongoClient

    #getClient = async () => {
        if (!this.client) this.client = await clientPromise

        return this.client
    }


    disconnect = async () => {
        return await this.client.close()
    }


    create = async <T>(
        databaseName: string,
        collectionName: string,
        document: T & Document,
        options?: InsertOneOptions,
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        const result = await this.db
            .collection(collectionName)
            .insertOne(document, options)

        if (result.acknowledged && result.insertedId)
            return { id: result.insertedId }


        throw new AppError({
            cause: { type: 'MONGODB', result },
            status: 500,
            message: result,
        })
    }


    createIndex = async <T>(
        databaseName: string,
        collectionName: string,
        indexSpec: TRequireOne<Partial<{ [K in keyof T]: number }>>,
        options: CreateIndexesOptions,
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        return await this.db
            .collection(collectionName)
            .createIndex(indexSpec as IndexSpecification, options)
    }


    find = async <T>(
        databaseName: string,
        collectionName: string,
        filter: Filter<T & Document>,
        options?: FindOptions,
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        return await this.db
            .collection(collectionName)
            .findOne(filter as Document, options) as T | null
    }


    findAll = async <T>(
        databaseName: string,
        collectionName: string,
        filter: Filter<T & Document>,
        skip: number = 0,
        limit: number = 10,
        sort?: TRequireOne<Partial<{ [K in keyof T]: number }>>,
        options?: FindOptions,
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        const result = await (this.db
            .collection(collectionName)
            .aggregate([
                { $match: filter as Document },
                { $sort: sort ?? { _id: 1 } },
                {
                    $facet: {
                        metadata: [
                            { $count: 'count' },
                        ],
                        data: [
                            { $skip: skip },
                            { $limit: limit }
                        ],
                    },
                },

                // { $setWindowFields: { output: { totalCount: { $count: {} } } } },
                // { $skip: skip },
                // { $limit: limit } 
            ])
            // .project({
            //     count: { $arrayElemAt: ['$metadata.count', 0] },
            //     // data: { $last: '$data' },
            //     data: 1,
            // })
            .toArray())
        

        if (result.length > 0 &&
            result[0].data.length > 0)
            return {
                skip,
                limit,
                count: result[0].metadata[0].count,
                data: result[0].data,
            } as { count: number, skip: number, limit: number, data: T[] }

        return null
    }


    update = async <T>(
        databaseName: string,
        collectionName: string,
        filter: Filter<T & Document>,
        update: UpdateFilter<T & Document> | Partial<T & Document>,
        options?: UpdateOptions
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        const result = await this.db
            .collection(collectionName)
            .updateOne(filter as Document, update, options)

        return result

        if (result.acknowledged)
            return { id: filter._id as string }


        throw new AppError({
            cause: { type: 'MONGODB', result },
            status: 500,
            message: result,
        })
    }


    delete = async <T>(
        databaseName: string,
        collectionName: string,
        filter: Filter<T & Document>,
        options?: DeleteOptions,
    ) => {
        this.client = await this.#getClient()
        this.db = this.client.db(databaseName)

        const result = await this.db
            .collection(collectionName)
            .deleteOne(filter as Document, options)


        if (result.acknowledged)
            return { id: filter._id as string }


        throw new AppError({
            cause: { type: 'MONGODB', result },
            status: 500,
            message: result,
        })
    }
}