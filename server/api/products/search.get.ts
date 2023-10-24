import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()

    const token = await getToken({ event })
    const { search_query, limit } = getQuery(event)

    const products = await $fetch(`${runtimeConfig.public.apiBase}/products/search`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        },
        query: {
            search_query
        }
    }) as any

    if(limit){
        const limitedProducts = products.slice(0, limit)
        return limitedProducts
    }

    return products
})