export default interface User {
    name: string,
    bio: string,
    discordId: string,
    isAdmin: boolean,
    image: string | null,
    banner: string | null,
}