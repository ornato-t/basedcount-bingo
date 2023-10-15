export interface User {
    name: string,
    bio: string,
    discordId: string,
    isAdmin: boolean,
    image: string | null,
    banner: string | null,
}

export async function getProfile(user: User) {
    return {
        name: user.name,
        admin: user.isAdmin,
        bio: user.bio.length > 0 ? user.bio : null,
        image: user.image !== null ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.image}.webp` : null,
        banner: user.banner !== null ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.banner}.webp` : null
    }
}