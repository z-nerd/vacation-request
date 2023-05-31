import { CrudService } from "./crud.service";

export interface ConfigServiceProps {
    dataBase: string
    collection: string
}


export class ConfigService {
    #props: ConfigServiceProps
    static #instance: ConfigService

    private constructor(configServiceProps: ConfigServiceProps) {
        this.#props = configServiceProps
    }

    public static getInstance(crudService: CrudService = new CrudService(), configServiceProps: ConfigServiceProps = {
        dataBase: 'ecommerce',
        collection: 'config',
    }) {
        return this.#instance || (this.#instance = new this(configServiceProps));
    }

}