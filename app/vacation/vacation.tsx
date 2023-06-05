'use client'
import { useLocalStorage } from "react-use"
import { useGetVacation } from "./hook"
import { userRedirectLogin } from "@/hooks"


export interface VacationProps {
  // OnResult: (data: any) => void
  // OnError: (error: any) => void
}

export const Vacation = ({}: VacationProps) => {
  const [accessToken] = useLocalStorage('accessToken')
  const token = String(accessToken || '')
  const { data, error } = useGetVacation(token)
  userRedirectLogin((error as any)?.status)

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}