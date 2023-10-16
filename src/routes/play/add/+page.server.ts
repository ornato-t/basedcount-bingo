import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
    const { sql } = locals;
    const data = await parent();

    const added = await sql`
        SELECT box.text, u.name, u.image, u.discord_id AS id
        FROM box
        INNER JOIN discord_user AS u ON box.about_discord_id=u.discord_id
        WHERE u.token=${data.token ?? null}
    ` as { text: string, name: string, image: string, discord_id: string }[];

    return {
        users: data.users,
        token: data.token,
        added
    };
};

export const actions = {
    default: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const text = formData.get('text');
        const token = formData.get('token');
        const target = formData.get('target');

        if (text === null || token === null || target === null) throw error(400, { message: "All fields must be filled" });

        await sql`
            INSERT INTO box(text,creator_discord_id,about_discord_id)
            VALUES (
                ${text.toString()},
                (
                    SELECT discord_id
                    FROM discord_user
                    WHERE token=${token.toString()}
                    LIMIT 1
                ) , 
                ${target.toString()}
            )
        `;
    },
} satisfies Actions;
