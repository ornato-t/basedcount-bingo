import { dev } from "$app/environment";

const devChannel = '1137060282309562415';    //DEV channel; used for testing
const ids = {
    server: '826405737093136434',       //Discord ID of the server where the bingo game will run
    playerRole: '1146738386544111626',  //Discord ID of the role of the players - only people with this role will be allowed to play
    adminRole1: '1162879967705694318',  //Discord ID of the bingo master role - this is an admin
    adminRole2:  '928983928289771560',  //Discord ID of the admin role - this is also an admin
    channel: '1147008618894471188',     //Discord ID of the channel where notifications should be sent
}

export const serverId = ids.server;
export const bingoPlayerRole = !dev ? ids.playerRole : '';
export const bingoMasterRole = !dev ? ids.adminRole1 : '';
export const adminRole = !dev ? ids.adminRole2 : '';
export const bingoChannelId = !dev ? ids.channel : devChannel;
