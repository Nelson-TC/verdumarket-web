import { getToken } from "#auth"
import { InvoiceSchema } from "~/server/validation"

export default defineEventHandler(async(event) => {
    const runtimeConfig = useRuntimeConfig()

    const token = await getToken({ event })

    const body = await readBody(event)

    const id = getRouterParam(event, "id")

    
    let {value, error } = InvoiceSchema.validate(body)
    if (error) {
        console.error(error)
        throw createError({
            message: error.message.replace(/"/g, ""),
            statusCode: 400,
            fatal: false,
        });
    }
    
    try{
        const data: any = await $fetch(`${runtimeConfig.public.apiBase}/invoices/create/${id}`, {
            headers: {
                Authorization: "Bearer" + ` ${token?.accessToken}`
            },
            method: "POST",
            body
        }).catch((error) => {throw createError({message: error.message, statusCode: 500, fatal:false})})
        return data
    }catch(e: any){
        throw createError({
            message: e.message,
        });
    }
    
})