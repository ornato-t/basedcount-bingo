// import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Box } from '$lib/bingo';

export const load: PageServerLoad = async ({ parent, locals }) => {
    const { sql } = locals;
    const data = await parent();

    //Pulls the most recent card for the user with the provided token
    const ownCard = await sql`
        SELECT b.id, b.text, b.about_discord_id
        FROM box b
        INNER JOIN box_in_card bc ON b.id=bc.box_id
        INNER JOIN card c ON bc.card_owner_discord_id=c.owner_discord_id AND bc.card_round_number=c.round_number
        INNER JOIN discord_user u ON bc.card_owner_discord_id=u.discord_id
        WHERE c.round_number=(SELECT MAX(round_number) FROM card) AND u.token=${data.token ?? ''};
    ` as Box[];

    ownCard.splice(12, 0, { about_discord_id: null, id: NaN, text: 'image:/kekw.png', creator_discord_id: '' });

    return {
        users: data.users,
        token: data.token,
        cards: ownCard
    };
};

export const actions = {
    // default: async ({ request, locals }) => {
    //     const { sql } = locals;

    //     const formData = await request.formData();

    //     await sql`

    //     `;
    // },
} satisfies Actions;
