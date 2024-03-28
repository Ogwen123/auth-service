import bcrypt from "bcrypt"
import config from "../config.json"
import logger from "./logger"

export const hashPassword = async (password): Promise<string> => {
    const hash: string = await bcrypt.hash(password, config.password.salt_rounds)

    return hash
}

export const checkPassword = (password_hash, password): boolean => {
    return bcrypt.compareSync(password, password_hash)
}