export interface User {
    name: string,
    discord_id: string,
    admin: boolean,
    image: string | null,
    banner: string | null,
    token: string | null,   //This isn't always returned
}
