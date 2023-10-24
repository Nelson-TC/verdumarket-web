import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()
    const token = await getToken({ event })

    const saleId = getRouterParam(event, "id")


    const sale = await $fetch(`${runtimeConfig.public.apiBase}/sales/${saleId}`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        }
    })

    return sale
})