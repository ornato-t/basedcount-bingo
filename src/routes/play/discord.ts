import { DISCORD_TOKEN } from "$env/static/private";
import type { Box } from "$lib/bingo";
import { bingoChannelId, bingoPlayerRole } from "$lib/discord";

export async function sendBingoAnnouncement(boxes: { id: number, text: string, position: number, time: Date, url: string }[], userId: string, image: string, name: string) {
    return; //DEV
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
                    "icon_url": image
                },
                title: 'Bingo!',
                description:
                    `
                        <@${userId}> scored a bingo with the following boxes:
                        ${boxes.map(
                        box => `- \`[${box.text}](${box.url})\`\n`)
                        .join('')
                    }
                    `,
                image: { url: gif }
            }]
        })
    });
}

export async function sendBoxAnnouncement(box: Box, url: string, userId: string, image: string, name: string) {
    return; //DEV
    await fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: `${name}`,
                    "icon_url": image
                },
                title: 'Box ticked',
                description:
                    `
                        <@${userId}> ticked the following box:\n
                        [${box.text}](${url})
                    `,
            }]
        })
    });
}