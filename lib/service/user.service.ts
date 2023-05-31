import { compare, genSalt, hash } from "bcrypt";
import { CrudService } from "./crud.service";
import { AppError, validation } from "../error";
import RedisCache from "../redis";
import { ObjectId } from "mongodb";
import { BasicCrudService } from "./basic-crud.service";
import { Check2fa, FindByEmail, FindByPhone, FindByUsername, Login, Register } from "@/sdk/validation";
import { getAccessToken, getRefreshToken } from "../jwt";
import { IUser } from "@/sdk/model";
import { randomChar } from "@/sdk/utility";


export interface UserServiceProps {
    dataBase: string
    collection: string
    cache: {
        redis: RedisCache
        _2faNameSpace: string
    }
    crudService: CrudService
}

export class UserService extends BasicCrudService<IUser> {
    #props: UserServiceProps

    constructor(
        userService: UserServiceProps = {
            dataBase: 'vacation-request',
            collection: 'users',
            cache: {
                redis: RedisCache.Instance,
                _2faNameSpace: '_2fa'
            },
            crudService: new CrudService(),
        }
    ) {
        super({...userService})

        this.#props = userService
    }

    findByEmail = async (user: { email: string }) => {
        validation(FindByEmail, user)

        return await this.#props.crudService.find<IUser>(
            this.#props.dataBase,
            this.#props.collection,
            {
                email: user.email
            }
        )
    }

    findByPhone = async (user: { phone: string }) => {
        validation(FindByPhone, user)

        return await this.#props.crudService.find<IUser>(
            this.#props.dataBase,
            this.#props.collection,
            {
                phone: user.phone
            }
        )
    }

    findByUsername = async (user: { username: string }) => {
        validation(FindByUsername, user)

        return await this.#props.crudService.find<IUser>(
            this.#props.dataBase,
            this.#props.collection,
            {
                username: user.username
            }
        )
    }

    register = async (user: IUser) => {
        validation(Register, user)

        user.password = await hash(user.password, await genSalt(10))

        return await this.#props.crudService.create<IUser>(
            this.#props.dataBase,
            this.#props.collection,
            {
                ...user,
                role: 'user',
                joinDatetime: new Date().toISOString()
            }
        )
    }

    login = async (body: { username: string, password: string }) => {
        validation(Login, body)

        const user = await this.#props.crudService.find<IUser>(
            this.#props.dataBase,
            this.#props.collection,
            {
                $or: [
                    { email: body.username },
                    { phone: body.username },
                    { username: body.username }
                ]
            }
        )

        if (!user)
            throw new AppError({
                cause: {
                    type: 'AUTH',
                    name: 'LOGIN',
                    incorrect: 'username'
                },
                status: 401,
                message: `Username or password incorrect!`,
            })

        if (await compare(body.password, user.password)) {
            const _2faKey = this.#props.cache._2faNameSpace + ':' + user._id
            const opt = randomChar(5, '0123456789')

            await this.#props.cache.redis.client.set(_2faKey, opt, 'EX', 60)

            console.log(opt);

            const phone = user.phone.split('').reduce(
                (accumulator, currentValue, index, arr) => {
                    if (index > 2 && index < arr.length - 2) return accumulator + '*'

                    return accumulator + currentValue
                })

            const email = user.email.split('').reduce(
                (accumulator, currentValue, index, arr) => {
                    if (index > 2 && index < arr.indexOf('@')) return accumulator + '*'
                    return accumulator + currentValue
                })

            return {
                id: user._id,
                email,
                phone,
            }
        }


        throw new AppError({
            cause: {
                type: 'AUTH',
                name: 'LOGIN',
                incorrect: 'password'
            },
            status: 401,
            message: `Username or password incorrect!`,
        })
    }


    _2fa = async ({id, code}: {id: string, code: string}) => {
        validation(Check2fa, {id, code})

        const _2faKey = this.#props.cache._2faNameSpace + ':' + id
        const opt = await this.#props.cache.redis.client.get(_2faKey)
        

        if(opt == code) {
            const user = await this.#props.crudService.find<IUser>(
                this.#props.dataBase,
                this.#props.collection,
                {
                    _id: new ObjectId(id)
                }
            )

            if(user) {
                await this.#props.cache.redis.client.del(_2faKey)

                const { _id, username, role, email, fullname, phone, joinDatetime, birthday } = user
                
                const accessToken = getAccessToken({ _id, username, role, email, fullname, phone, joinDatetime, birthday })
                const refreshToken = getRefreshToken({ username })
                
                return { accessToken, refreshToken }
            }
        }


        throw new AppError({
            cause: {
                type: 'AUTH',
                name: '2FA'
            },
            status: 401,
            message: `Code isn't correct!`,
        })

    }
}