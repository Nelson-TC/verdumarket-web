import { getToken } from "#auth"

export default defineEventHandler(async (event) => {
    const token = await getToken({ event })
    const { search_query } = getQuery(event)

    const products = await $fetch("http://localhost:8080/api/products/search", {
        headers: {
            Authorization: "Bearer" + ` ${token?.accessToken}`
        },
        query: {
            search_query
        }
    })
    return products
})