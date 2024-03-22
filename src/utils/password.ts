import bcrypt from "bcrypt"
import config from "../../config.json"
import logger from "./logger"

export const hash_password = async (password): Promise<[string, string]> => {
    const salt: string = await bcrypt.genSalt(config.password.salt_rounds)

    const hash: string = await bcrypt.hash(password, salt)

    return [salt, hash]
}

export const check_password = (password_hash, password, salt) => {

}