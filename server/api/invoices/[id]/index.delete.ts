import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()

    const invoiceId = getRouterParam(event, "id")
    
    const token = await getToken({ event })
    
    try {
        const data = await $fetch(`${runtimeConfig.public.apiBase}/invoices/${invoiceId}`, {
            headers: {
                Authorization: "Bearer" + ` ${token?.accessToken}`
            },
            method: "DELETE",
        }).catch((error) => console.log(error))
        console.log(data)
    } catch (e: any) {
        throw createError({
            message: e.message,
        });
    }
})