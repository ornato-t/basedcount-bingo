import { DISCORD_TOKEN } from "$env/static/private";
import type { Box } from "$lib/bingo";
import { bingoChannelId, bingoMasterRole, bingoPlayerRole } from "$lib/discord";
import { regexImage, getImgUrl } from "$lib/image";
import type { User } from "$lib/user";

export async function sendBingoAnnouncement(boxes: { id: number, text: string, position: number, time: Date, url: string }[], userId: string, image: string, name: string) {
    const gif = 'https://media.giphy.com/media/DFu7j1d1AQbaE/giphy.gif';

    await fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `<@&${bingoPlayerRole}>`,
            embeds: [{
                author: {
                    name: `${name}`,
                    icon_url: image
                },
                title: 'Bingo!',
                description:
                    `
                        <@${userId}> scored a bingo with the following boxes:
                        ${boxes.map(
                        box => `- ${bingoBoxName(box)}\n`)
                        .join('')
                    }
                    `,
                image: { url: gif }
            }]
        })
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
    let body: { embeds: { author: { name: string, icon_url: string }, title: string, description: string, image?: { url: string } }[] };

    if (regexImage.test(box.text)) {
        body = {
            embeds: [{
                author: {
                    name: `${name}`,
                    icon_url: image
                },
                title: 'Box ticked',
                description: `
                    <@${userId}> ticked the following box:\n
                    [Image](${url})
                `,
                image: {
                    url: getImgUrl(box)
                }
            }]
        }
    } else {
        body = {
            embeds: [{
                author: {
                    name: `${name}`,
                    icon_url: image
                },
                title: 'Box ticked',
                description: `
                    <@${userId}> ticked the following box:\n
                    [${box.text}](${url})
                `,
            }]
        }
    }

    await fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}

export async function sendContestation(box: Box, author: User, contester: User, url: string, reason: string) {
    let body: { content: string, embeds: { author: { name: string, icon_url: string }, title: string, description: string, image?: { url: string } }[] };

    if (regexImage.test(box.text)) {
        body = {
            content: `<@&${bingoMasterRole}>`,
            embeds: [{
                author: {
                    name: contester.name,
                    icon_url: contester.image ?? ''
                },
                title: 'Contestation',
                description: `
                    <@${contester.discord_id}> disputes <@${author.discord_id}> ticking the following box:\n
                    [Image](${url})\n
                    Reason:
                    > ${reason}
                `,
                image: {
                    url: getImgUrl(box)
                }
            }]
        }
    } else {
        body = {
            content: `<@&${bingoMasterRole}>`,
            embeds: [{
                author: {
                    name: contester.name,
                    icon_url: contester.image ?? ''
                },
                title: 'Contestation',
                description: `
                    <@${contester.discord_id}> disputes <@${author.discord_id}> ticking the following box:\n
                    [${box.text}](${url})\n
                    Reason:
                    > ${reason}
                `,
            }]
        }
    }

    await fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}