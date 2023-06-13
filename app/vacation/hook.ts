import { IVacation } from "@/sdk/model";
import { fetcher } from "@/sdk/utility";
import { RequestVacation } from "@/sdk/validation/request-vacation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent } from "react";


export const useGetVacationList = (token: string) => {
    return useQuery({
        queryKey: ['getVacation'],
        queryFn: () => fetcher('/api/vacation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
            },
        }),
        retry: 0,
    })
}


export type VacationRequestFormData = Omit<IVacation, 'id' | 'status' | 'requestedDatetime'>

interface MutationFnProps { token: string, vacation: VacationRequestFormData }
export const usePostVacationRequest = () => {
    return useMutation({
        mutationKey: ['postVacationRequest'],
        mutationFn: ({token, vacation}: MutationFnProps) => fetcher('/api/vacation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
            },
            body: JSON.stringify(vacation),
        }),
        retry: 0,
    })
}



export const handleVacationRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const txtFormErrorRef = document.querySelector('form > span.error-form') as HTMLSpanElement
    const txtFullname: HTMLInputElement = event.currentTarget.fullname
    const txtFullnameErrorRef = document.querySelector('#fullname + span.error') as HTMLInputElement
    const txtFrom: HTMLInputElement = event.currentTarget.from
    const txtFromErrorRef = document.querySelector('#from + span.error') as HTMLInputElement
    const txtTo: HTMLInputElement = event.currentTarget.to
    const txtToErrorRef = document.querySelector('#to + span.error') as HTMLInputElement
    const txtDescription: HTMLInputElement = event.currentTarget.description
    const txtDescriptionErrorRef = document.querySelector('#description + span.error') as HTMLInputElement
    // const btnSubmitRef: HTMLInputElement = event.currentTarget.request

    const formData: VacationRequestFormData = {
        fullname: txtFullname.value,
        from: txtFrom.value,
        to: txtTo.value,
        description: txtDescription.value
    }

    txtFullnameErrorRef.textContent = ""
    txtFromErrorRef.textContent = ""
    txtToErrorRef.textContent = ""
    txtDescriptionErrorRef.textContent = ""
    // btnSubmitRef.disabled = true


    interface IVError {
        fullname?: string,
        from?: string,
        to?: string,
        description?: string,
    }

    const error: IVError | null = RequestVacation(formData)

    if (error) {
        if (error?.fullname) txtFullnameErrorRef.textContent = error.fullname
        if (error?.from) txtFromErrorRef.textContent = error.from
        if (error?.to) txtToErrorRef.textContent = error.to
        if (error?.description) txtDescriptionErrorRef.textContent = error.description
    }
    // btnSubmitRef.disabled = false


    return { data: formData, error }
}