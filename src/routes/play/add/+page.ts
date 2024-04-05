import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
    const users = new Map<string, DiscordUser | null>();

    addToMap(data.added, users);
    addToMap(data.addedByOthers, users);

    for (const [id, user] of users.entries()) {
        if (user !== null) continue;

        const match = data.userList.find((el) => el.discord_id === id);
        if (match === undefined) continue;

        users.set(id, { name: match.name, image: match.image ?? '', });
    }

    for (const box of data.added) {
        if (box.about_discord_id === null || box.about_discord_id.length === 0 || box.about_name !== null) continue;
        const match = users.get(box.about_discord_id)!;

        box.about_name = match.name;
        box.about_image = match.image;
    }

    for (const box of data.addedByOthers) {
        if (box.about_discord_id === null || box.about_discord_id.length === 0 || box.about_name !== null) continue;
        const match = users.get(box.about_discord_id)!;

        box.about_name = match.name;
        box.about_image = match.image;
    }

    return data;
};

function addToMap(data: { about_discord_id: string | null, about_name: string, about_image: string }[], users: Map<string, DiscordUser | null>) {
    data.forEach(box => {
        if (box.about_discord_id == null || users.get(box.about_discord_id) !== undefined) return;

        if (box.about_name == null) users.set(box.about_discord_id, null);
        else users.set(box.about_discord_id, { name: box.about_name, image: box.about_image });
    });
}

interface DiscordUser {
    name: string;
    image: string;
}