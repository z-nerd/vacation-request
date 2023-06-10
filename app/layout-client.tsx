'use client'

import { useRefreshLogin } from "@/hooks"

export interface LayoutClientProps {

}

export const LayoutClient = ({}: LayoutClientProps) => {
    useRefreshLogin()

    return (
        <>
        </>
    )
  
}