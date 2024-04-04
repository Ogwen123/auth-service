import Joi from "joi"

export const now = (): number => {
    return Date.now()
}

export const iso = (): string => {
    return (new Date()).toISOString()
}

export const validate = (schema: Joi.Schema, data) => {
    const validate = schema.validate(data, { abortEarly: false })

    if (validate.error) {
        return {
            error: true,
            data: validate.error.details.map((error) => {
                return error.message
            })
        }
    }
    return {
        error: false,
        data: validate.value
    }
}

export const filterErrors = (errors, route: "login" | "register") => {
    return errors.map((error) => {
        if (error.startsWith('"password"')) {
            return route === "login" ? "Incorrect username or password." : "Password must have a uppercase, lowercase and a number."
        } else {
            return error
        }
    })
}