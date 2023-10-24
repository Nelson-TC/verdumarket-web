import { PostSchema } from "~/server/validation"
import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()

    const productId = getRouterParam(event, "id")
    
    const token = await getToken({ event })
    
    const body = await readBody(event)

    let { value, error } = PostSchema.validate(body)
    
    if (error) {
        console.error(error)
        throw createError({
            message: error.message.replace(/"/g, ""),
            statusCode: 400,
            fatal: false,
        });
    }

    try {
        const data = await $fetch(`${runtimeConfig.public.apiBase}/products/${productId}`, {
            headers: {
                Authorization: "Bearer" + ` ${token?.accessToken}`
            },
            method: "PUT",
            body
        }).catch((error) => console.log(error))
        console.log(data)
    } catch (e: any) {
        throw createError({
            message: e.message,
        });
    }
})