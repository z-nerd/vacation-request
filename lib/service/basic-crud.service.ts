import { IsMongoDbId } from "@/sdk/validation";
import { CrudService } from "./crud.service";
import { ObjectId } from "mongodb";
import { validation } from "../error";


export interface BasicCrudProps {
    dataBase: string
    collection: string
    crudService: CrudService
}


export class BasicCrudService <T> {
    #props: BasicCrudProps


    constructor(basicCrud: BasicCrudProps) {
        this.#props = basicCrud
    }

    
    findById = async (id: string) => {
        validation(IsMongoDbId, { id })

        return await this.#props.crudService.find<{ _id: ObjectId}>(
            this.#props.dataBase,
            this.#props.collection,
            {
                _id: new ObjectId(id)
            }
        ) as T | null
    }


    updateById = async (id: string, update: any) => {
        validation(IsMongoDbId, { id })

        return await this.#props.crudService.update<{ _id: ObjectId}>(
            this.#props.dataBase,
            this.#props.collection,
            {
                _id: new ObjectId(id)
            },
            { $set: update, $currentDate: { "lastModified": true } },
        )
    }


    deleteById = async (id: string) => {
        validation(IsMongoDbId, { id })

        return await this.#props.crudService.delete<{ _id: ObjectId}>(
            this.#props.dataBase,
            this.#props.collection,
            {
                _id: new ObjectId(id)
            }
        )
    }
}