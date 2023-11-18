import { DISCORD_TOKEN } from "$env/static/private";
import type { Box } from "$lib/bingo";
import { bingoChannelId, bingoMasterRole, bingoPlayerRole } from "$lib/discord";
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

export async function sendBoxUncheckAnnouncement(box: string, url: string, userId: string, image: string, name: string) {
    if (regexImage.test(box)) {
        await sendMessage({
            embeds: [{
                author: { name: `${name}`, icon_url: image },
                title: 'Box unchecked',
                description: `
                    <@${userId}> ubchecked the following box:\n
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
            content: `<@&${bingoMasterRole}>`,
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
            content: `<@&${bingoMasterRole}>`,
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
        author: { name: string, icon_url: string },
        title: string,
        description: string,
        image?: { url: string }
    }[]
}