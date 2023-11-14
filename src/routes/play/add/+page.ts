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

    const added = data.added.map(user => {
        if (user.about_discord_id === null || user.about_discord_id.length === 0 || user.about_name !== null) return user;
        const match = users.get(user.about_discord_id)!;
        return {
            about_discord_id: user.about_discord_id,
            box_id: user.box_id,
            box_text: user.box_text,
            about_image: match.image,
            about_name: match.name,
        }
    });

    const addedByOthers = data.addedByOthers.map(user => {
        if (user.about_discord_id === null || user.about_discord_id.length === 0 || user.about_name !== null) return user;
        const match = users.get(user.about_discord_id)!;
        return {
            about_discord_id: user.about_discord_id,
            box_id: user.box_id,
            box_text: user.box_text,
            about_image: match.image,
            about_name: match.name,
            creator_name: user.creator_name,
            creator_image: user.creator_image,
        }
    });

    return {
        users: data.users,
        token: data.token,
        added: added,
        addedByOthers: addedByOthers,
        userList: data.userList,
    };
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