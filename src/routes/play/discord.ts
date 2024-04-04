import { DISCORD_TOKEN } from "$env/static/private";
import type { Box } from "$lib/bingo";
import { bingoChannelId, bingoMasterRole, bingoPlayerRole } from "$lib/discordIds";
import { regexImage, getImgUrl } from "$lib/image";
import type { User } from "$lib/user";

export async function sendBingoAnnouncement(boxes: { id: number, text: string, position: number, time: Date, url: string }[], userId: string, image: string, name: string) {
    const gif = 'https://media.giphy.com/media/DFu7j1d1AQbaE/giphy.gif';

    await sendMessage({
        content: `<@&${bingoPlayerRole}>`,
        embeds: [{
            author: { name: `${name}`, icon_url: image },
            title: 'Bingo!',
            description: `
                    <@${userId}> scored a bingo with the following boxes:
                    ${boxes.map(box => `- ${bingoBoxName(box)}\n`).join('')}
                `,
            image: { url: gif }
        }]
    });
}

function bingoBoxName(box: { id: number, text: string, position: number, time: Date, url: string }): string {
    if (regexImage.test(box.text)) {
        return `[Image](${getImgUrl(box)}) - [Message](${box.url})`;
    } else {
        return `[${box.text}](${box.url})`;
    }
}

export async function sendBoxAnnouncement(box: Box, url: string, userId: string, image: string, name: string) {
    if (regexImage.test(box.text)) {
        await sendMessage({
            embeds: [{
                author: { name: `${name}`, icon_url: image },
                title: 'Box checked',
                description: `
                    <@${userId}> checked the following box:\n
                    [Image](${url})
                `,
                image: { url: getImgUrl(box) }
            }]
        });
    } else {
        await sendMessage({
            embeds: [{
                author: { name: `${name}`, icon_url: image },
                title: 'Box checked',
                description: `
                    <@${userId}> checked the following box:\n
                    [${box.text}](${url})
                `,
            }]
        });
    }
}

export async function sendNewRoundAnnouncement(admin_discord_id: string, admin_name: string, admin_image: string, winnersArr: string[]) {
    let embed: string;
    if (winnersArr.length > 0) {
        embed = `
            <@${admin_discord_id}> has started a new round.\n
            Winners from last round:
            ${winnersArr.map(id => `- <@${id}>\n`).join('')}
        `;
    } else {
        embed = `
            <@${admin_discord_id}> has started a new round.\n
            No winners were registered
        `;
    }

    await sendMessage({
        content: `!bingo <@&${bingoPlayerRole}>\nRound begun on <t:${Math.round(new Date().valueOf() / 1000)}:f>`,
        embeds: [{
            author: { name: `${admin_name}`, icon_url: admin_image },
            title: 'New round',
            description: embed,
        }]
    });
}
export async function sendForcedNewRoundAnnouncement() {
    await sendMessage({
        content: `!bingo <@&${bingoPlayerRole}>\nRound begun on <t:${Math.round(new Date().valueOf() / 1000)}:f>`,
        embeds: [{
            title: 'Forced new round',
            description: `
                A week or longer has passed since the start of the current round.
                In accordance with the rules, the round has been terminated and a new one was automatically started.
            `,
        }]
    });
}

export async function sendBoxUncheckAnnouncement(box: string, url: string, userId: string, image: string, name: string) {
    if (regexImage.test(box)) {
        await sendMessage({
            embeds: [{
                author: { name: `${name}`, icon_url: image },
                title: 'Box unchecked',
                description: `
                    <@${userId}> unchecked the following box:\n
                    [Image](${url})
                `,
                image: { url: getImgUrl({ text: box }) }
            }]
        });
    } else {
        await sendMessage({
            embeds: [{
                author: { name: `${name}`, icon_url: image },
                title: 'Box unchecked',
                description: `
                    <@${userId}> unchecked the following box:\n
                    [${box}](${url})
                `,
            }]
        });
    }
}

export async function sendContestation(box: Box, author: User, contester: User, url: string, reason: string) {
    if (regexImage.test(box.text)) {
        await sendMessage({
            content: `<@&${bingoMasterRole}> <@${author.discord_id}>`,
            embeds: [{
                author: { name: contester.name, icon_url: contester.image ?? '' },
                title: 'Contestation',
                description: `
                    <@${contester.discord_id}> disputes <@${author.discord_id}> checked the following box:\n
                    [Image](${url})\n
                    Reason:
                    > ${reason}
                `,
                image: { url: getImgUrl(box) }
            }]
        });
    } else {
        await sendMessage({
            content: `<@&${bingoMasterRole}> <@${author.discord_id}>`,
            embeds: [{
                author: { name: contester.name, icon_url: contester.image ?? '' },
                title: 'Contestation',
                description: `
                    <@${contester.discord_id}> disputes <@${author.discord_id}> checked the following box:\n
                    [${box.text}](${url})\n
                    Reason:
                    > ${reason}
                `,
            }]
        });
    }
}

function sendMessage(body: Body) {
    return fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}

interface Body {
    content?: string,
    embeds?: {
        author?: { name: string, icon_url: string },
        title: string,
        description: string,
        image?: { url: string }
    }[]
}