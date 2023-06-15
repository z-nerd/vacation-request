'use client'

import { useBrowserStorage } from "@/hooks"

export interface HomeProp {

}

export const Home = ({}: HomeProp) => {
    const { userInfo } = useBrowserStorage()

    return (
        <>
            <h1>not implemented yet! :&#40;</h1>
        </>
    )
}