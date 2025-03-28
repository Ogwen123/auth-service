import { Perm } from "../global/types"

export const permissions = {
    1: "ACTIVE",
    2: "ADMIN"
}

export const services = {
    1: "TABLE",
    2: "TRACKER",
    4: "CARDS"
}

export const flagBFToPerms = (bf: number, use_services: boolean = false) => {
    let perms: Perm[] = []

    const to_use = use_services ? services : permissions

    for (let i of Object.keys(to_use)) {
        const j = parseInt(i)
        if ((j & bf) === j) {
            perms.push(to_use[j])
        }
    }

    return perms
}