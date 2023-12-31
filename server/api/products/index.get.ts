import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()
    
    const token = await getToken({ event })

    const products = await $fetch(`${runtimeConfig.public.apiBase}/products`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        }
    })
    return products
})