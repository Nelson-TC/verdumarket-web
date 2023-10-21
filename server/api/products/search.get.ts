import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const runtimeConfig =  useRuntimeConfig()

    const token = await getToken({ event })
    const { search_query } = getQuery(event)

    const products = await $fetch(`${runtimeConfig.public.apiBase}/products/search`, {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        },
        query: {
            search_query
        }
    })
    return products
})