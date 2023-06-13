'use client'
import { handleVacationRequestSubmit, usePostVacationRequest } from "./hook"
import { useBrowserStorage, useNeedLogin } from "@/hooks"


export interface VacationRequestProps {
}

export const VacationRequest = ({ }: VacationRequestProps) => {
  useNeedLogin(true)
  const { accessToken } = useBrowserStorage()
  const { data, isLoading, isSuccess, error, mutate } = usePostVacationRequest()


  return (
    <>
      <form
        className="vacation-request-form"
        autoComplete="off"
        noValidate
        onSubmit={(e) => {
          const handler = handleVacationRequestSubmit(e)
          if (handler.error === null) mutate({
            token: accessToken || '', 
            vacation: handler.data
          })
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