import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()
    const token = await getToken({ event })

    const invoiceId = getRouterParam(event, "invoiceId")
    console.log(invoiceId)


    const sale = await $fetch(`${runtimeConfig.public.apiBase}/sales/by-invoice-id/${invoiceId}`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        }
    })

    return sale
})