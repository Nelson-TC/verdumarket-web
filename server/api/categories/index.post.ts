import { CategorySchema } from "~/server/validation"
import { getToken } from "#auth"


export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()

    const token = await getToken({ event })
    
    const body = await readBody(event)

    let { value, error } = CategorySchema.validate(body)
    if (error) {
        throw createError({
            message: error.message.replace(/"/g, ""),
            statusCode: 400,
            fatal: false,
        });
    }

    try {
        const data = await $fetch(`${runtimeConfig.public.apiBase}/categories`, {
            headers: {
                Authorization: "Bearer" + ` ${token?.accessToken}`
            },
            method: "POST",
            body
        }).catch((error) => console.log(error))
        console.log(data)
    } catch (e: any) {
        throw createError({
            message: e.message,
        });
    }
})