'use client'
import { useGetVacationList } from "./hook"
import { useBrowserStorage } from "@/hooks"


export interface VacationListProps {
}

export const VacationList = ({}: VacationListProps) => {
  const {accessToken} = useBrowserStorage()
  const token = accessToken || ''
  const { data, error } = useGetVacationList(token)
  

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}