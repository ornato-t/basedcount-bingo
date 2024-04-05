import { redirect } from '@sveltejs/kit';
import { getServerUsers } from '$lib/discordAPI';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const data = await parent();

    //Check if logged and if admin, if not redirect to home page
    if (data.currentUser == null || !data.currentUser.admin) throw redirect(308, '/');

    return {
        users: data.users,
        token: data.token,
    };
};

export const actions = {
    default: async ({ request, locals }) => {
        const { sql } = locals;
        
        const formData = await request.formData();
        const targetId = formData.get('id');
        if (targetId === null) return { failure: false };

        const users = await getServerUsers();
        const target = users.find(user => user.discord_id === targetId.toString());
        if (target === undefined) return { failure: false };

        const uuid = crypto.randomUUID();
        await sql`
            INSERT INTO discord_user
            VALUES(
                ${target.discord_id},
                ${target.name}, 
                false,
                ${target.image},
                null,
                ${uuid},
                false
            )
        `;
    },
} satisfies Actions;
