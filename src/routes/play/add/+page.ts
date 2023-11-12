import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
    //This is a hack fetch names and images of of non players. It sucks, I'm aware

    const added: typeof data.added = [];
    for (const user of data.added) {
        if (user.about_name === null && user.about_image === null) {
            const match = data.userList.find((el) => el.discord_id === user.about_discord_id);
            added.push({
                box_id: user.box_id,
                about_discord_id: user.about_discord_id,
                about_image: match?.image ?? 'null',
                about_name: match?.name ?? '',
                box_text: user.box_text
            });
        } else {
            added.push(user);
        }
    }

    const addedByOthers: typeof data.addedByOthers = [];
    for (const user of data.addedByOthers) {
        if (user.about_name === null && user.about_image === null) {
            const match = data.userList.find((el) => el.discord_id === user.about_discord_id);
            addedByOthers.push({
                box_id: user.box_id,
                about_discord_id: user.about_discord_id ?? '',
                about_image: match?.image ?? 'null',
                about_name: match?.name ?? '',
                box_text: user.box_text ?? '',
                creator_image: user.creator_image,
                creator_name: user.creator_name,
            });
        } else {
            addedByOthers.push(user);
        }
    }

    return {
        users: data.users,
        token: data.token,
        added,
        addedByOthers,
        userList: data.userList,
    };
};