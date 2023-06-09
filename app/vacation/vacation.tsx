'use client'
import { useLocalStorage } from "react-use"
import { useGetVacationList } from "./hook"
import { userRedirectLogin } from "@/hooks"


export interface VacationListProps {
  // OnResult: (data: any) => void
  // OnError: (error: any) => void
}

export const VacationList = ({}: VacationListProps) => {
  const [accessToken] = useLocalStorage('accessToken')
  const token = String(accessToken || '')
  const { data, error } = useGetVacationList(token)
  userRedirectLogin((error as any)?.status)

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}