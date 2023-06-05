export const randomChar = (length: number, chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') => {
    let a = chars.split('')
    let b = []
    for (let i = 0; i < length; i++) {
        let j = +(Math.random() * (a.length - 1)).toFixed(0)
        b[i] = a[j]
    }
    return b.join("")
}


export const mapToObj = (map: any, keys: string[] = []) => {
    const obj: any = {}

    map.forEach((value: string, key: string) => obj[key] = value)

    return obj
}



export const removePropsFromObj = (obj: any, props: string[] = []) => {
    if (props.length === 0)
        return obj

    let result: any = {}
    for (const key in obj)
        if (!props.find(item => key === item))
            result[key] = obj[key]

    return result
}


export const freeObject = (obj: any) => {
    for (const key of Object.keys(obj))
        delete obj[key]
}


export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type TRequireOne<T> = T & { [P in keyof T]: Required<Pick<T, P>> }[keyof T]


export const fetcher = async <T>(
    url: string,
    option: RequestInit | undefined = undefined
) => {
    const res = await fetch(url, option)
    const data = await res.json()

    if(res.status !== 200) {
        return Promise.reject({ ...data, status: res.status })
    }

    return data as T
}