import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const text = formData.get('text');
        const token = formData.get('token');
        const target = formData.get('target');

        if(text === null || token === null || target === null) throw error(400, {message: "All fields must be filled"});

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
