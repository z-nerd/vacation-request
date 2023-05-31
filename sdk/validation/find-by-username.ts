import Schema from "validate"


const isUsername = (val: string) => /^[A-Za-z](?:[a-zA-Z0-9]|([_])(?!\1)){2,30}[A-Za-z\d]$/.test(val)
const isProfane = (string: string, wordList = ['ass', 'fuck']) => {
    return wordList.filter((word) => {
        return new RegExp(word).test(string.toLowerCase())
    }).length > 0 || false
}
const isUsernameInBlackList = (val: string) => !isProfane(val)


export const FindByUsername = (value: any) => {
    const errors: any = {}

    const validator = new Schema({
        username: {
            required: true,
            type: String,
            use: {
                // isUsername,
                isUsernameInBlackList
            },
            // length: { min: 4, max: 8 },
            message: {
                // length: (path, ctx, args) => {
                //     const feild = (ctx as any)[path]

                //     if(feild.length < args.min)
                //         return `It's too short! ${feild.length}`
                //     else
                //         return `It's too much! ${feild.length}`
                // },
                // isUsername: (path: any) => `${path} must be a valid!!`,
                isUsernameInBlackList: (path: any) => `${path} It's not allows!!`,
            }
        },
    })

    
    for (const err of validator.validate({ ...value }, { strict: false }))
        errors[err.path] = (err as any).message


    return Object.keys(errors).length > 0 ? errors : null
}