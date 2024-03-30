import { Perm } from "../global/types"

export const permissions = {
    1: "ACTIVE",
    2: "ADMIN"
}

export const flagBFToPerms = (bf: number) => {
    let perms: Perm[] = []

    for (let i of Object.keys(permissions)) {
        const j = parseInt(i)
        if ((j & bf) === j) {
            perms.push(permissions[j])
        }
    }

    return perms
}