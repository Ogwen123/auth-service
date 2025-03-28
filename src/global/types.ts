export type Perm = "ACTIVE" | "ADMIN"

export type TokenPayload = {
    id: string,
    expiry: number
}

export type LoginResponse = {
    token: string,
    id?: string,
    username?: string,
    permissions?: Perm[],
    name?: string
}