import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()
    
    const token = await getToken({ event })

    const sales = await $fetch(`${runtimeConfig.public.apiBase}/sales`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        }
    })
    return sales
})