import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()
    
    const token = await getToken({ event })

    const invoices = await $fetch(`${runtimeConfig.public.apiBase}/invoices`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        }
    })
    return invoices
})