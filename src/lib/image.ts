export const regexImage = /image:\/\S+\.(jpg|jpeg|png|gif|webp|svg)/; //Matches image:/
export const getImgUrl = (card: { text: string }) => card.text.substring(card.text.indexOf(':') + 2); //Extracts "/sample.png" from "image:/sample.png"
