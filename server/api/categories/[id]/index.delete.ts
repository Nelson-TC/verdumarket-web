import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()

    const productId = getRouterParam(event, "id")
    
    const token = await getToken({ event })
    
    try {
        const data = await $fetch(`${runtimeConfig.public.apiBase}/categories/${productId}`, {
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