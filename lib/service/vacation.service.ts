import { genSalt, hash } from "bcrypt";
import { CrudService } from "./crud.service";
import { validation } from "../error";
import { BasicCrudService } from "./basic-crud.service";
import { FindByEmail, FindByPhone, FindByUsername, Register, RequestApprover, RequestVacation } from "@/sdk/validation";
import { IUser, IVacation } from "@/sdk/model";
import { ObjectId } from "mongodb";


export interface VacationServiceProps {
    dataBase: string
    collection: string
    crudService: CrudService
}


export class VacationService extends BasicCrudService<IUser> {
    #props: VacationServiceProps

    constructor(
        vacationService: VacationServiceProps = {
            dataBase: 'vacation-request',
            collection: 'vacation',
            crudService: new CrudService(),
        }
    ) {
        super({...vacationService})

        this.#props = vacationService
    }

    request = async (requestVacation: IVacation, tUser: IUser) => {
        if(tUser.role === 'user') 
            requestVacation = { ...requestVacation, fullname: tUser.fullname }

        validation(RequestVacation, requestVacation)

        return await this.#props.crudService.create<IVacation>(
            this.#props.dataBase,
            this.#props.collection,
            {
                ...requestVacation,
                status: 'waiting',
                requestedDatetime: new Date().toISOString(),
            }
        )
    }

    getWaitingRequest = async (tUser: IUser) => {

        return await this.#props.crudService.findAll<IVacation>(
            this.#props.dataBase,
            this.#props.collection,
            {
                status: 'waiting'
            }
        )
    }

    approver = async (id: string, status: string) => {
        validation(RequestApprover, {id, status})

        return await this.updateById(id, {status})
    }
}