'use client'
import { useLocalStorage } from "react-use"
import { handleVacationRequestSubmit, usePostVacationRequest } from "./hook"
import { userRedirectLogin } from "@/hooks"


export interface VacationRequestProps {
}

export const VacationRequest = ({ }: VacationRequestProps) => {
  const [accessToken] = useLocalStorage('accessToken')
  const token = String(accessToken || '')

  const { data, isLoading, isSuccess, error, mutate } = usePostVacationRequest(token)
  userRedirectLogin((error as any)?.status)

  return (
    <>
      <form
        className="vacation-request-form"
        autoComplete="off"
        noValidate
        onSubmit={(e) => {
          const handler = handleVacationRequestSubmit(e)
          if (handler.error === null) mutate(handler.data)
        }}>
        <span className="error-form" aria-live="polite">{String((error as any)?.error?.message || '')}</span>

        <label htmlFor="fullname">
          <span>fullname:</span>
          <input type="text" id="fullname" name="fullname" placeholder="Enter fullname" required />
          <span className="error" aria-live="polite"></span>
        </label>

        <label htmlFor="from">
          <span>from:</span>
          <input type="date" id="from" name="from" placeholder="Enter from" required />
          <span className="error" aria-live="polite"></span>
        </label>

        <label htmlFor="to">
          <span>to:</span>
          <input type="date" id="to" name="to" placeholder="Enter to" required />
          <span className="error" aria-live="polite"></span>
        </label>

        <label htmlFor="description">
          <span>description:</span>
          <input type="text" id="description" name="description" placeholder="Enter description" required />
          <span className="error" aria-live="polite"></span>
        </label>

        <button type="submit" name="request" disabled={isLoading}>Submit</button>
      </form>
    </>
  )
}