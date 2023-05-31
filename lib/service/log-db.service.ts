import { ObjectId } from "mongodb"
import { CrudService } from "./crud.service"
import { removePropsFromObj } from "@/sdk/utility"

export interface LogDbServiceProps {
    _id: string
    taskName?: string
    taskStatus?: 'pending' | 'done' | 'faild'
    taskStartedAt?: string
    taskEndedAt?: string
    type?: 'error' | 'info' | 'warning'
    block?: any
    body?: any
    error?: any
    ip?: any
    ua?: string
    result?: any
    crudService: CrudService
}

export class LogDbService {
    _props!: LogDbServiceProps

    constructor(
        logDbServiceProps: LogDbServiceProps = {
            _id: new ObjectId().toString(),
            crudService: new CrudService()
        }
    ) {
        this._props = {
            ...logDbServiceProps,
        }
    }

    getId = () => this._props._id

    startTask = (name: LogDbServiceProps['taskName']) => {
        this._props.taskName = name
        this._props.taskStatus = 'pending'
        this._props.taskStartedAt = new Date().toISOString()
    }

    endTask = (success: boolean) => {
        this._props.taskStatus = success ? 'done' : 'faild'
        this._props.taskEndedAt = new Date().toISOString()
        this._props.type = success ? 'info' : 'error'
    }

    addBody = (body: any = {}, props: string[] = []) => this._props.body = removePropsFromObj(body, props)
    addResult = (result: any = {}, props: string[] = []) => this._props.result = removePropsFromObj(result, props)
    addError = (error: any = {}, props: string[] = []) => this._props.error = removePropsFromObj(error, props)
    addBlock = (block: any = {}, props: string[] = []) => this._props.block = removePropsFromObj(block, props)
    addIp = (ip: string) => this._props.ip = ip
    addUa = (ua: string) => this._props.ua = ua


    done = async (result: any = {}, props: string[] = []) => {
        this._props.result = removePropsFromObj(result, props)
        this._props.taskStatus = result.success ? 'done' : 'faild'
        this._props.taskEndedAt = new Date().toISOString()
        this._props.type = result.success ? 'info' : 'error'

        await this.expose()
    }

    faild = async () => {
        this._props.taskStatus = 'faild'
        this._props.taskEndedAt = new Date().toISOString()
        this._props.type = 'error'

        await this.expose()
    }

    expose = async () => {
        const {
            crudService,
            ...logProps
        } = this._props

        await this._props.crudService.create(
            'ecommerce-log',
            'log',
            {
                ...logProps,
            },
        )
    }
}