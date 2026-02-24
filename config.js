const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "FAIZAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWU5zdHRWRXYwSUZIVjI3QnMxSkpTL01tM1A3T1VvK1lESnFHOFBJZU8wUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidmhmWkJGbzc4eU5iVGticXBpQm9TeTgvYXdsSStnOUxadEZ6OXh2bGNoRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlSEJ2aGpmamdvZXNqY1VVSzhwaitKSk0yRHg1Sk9qNE1DczNNeG9xRVhVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIreEd6VUJWTktuOGhVckEzYUVqL0JkQmU5d0ViNXl2OXMyNXF1WTNsbkZNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFJOGk0eHVhOXp4TTkwZk82ZUVTWGMvSmdnQzU1Y1JWMlFidGZ0UkJvMEk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9DaGpsMTV0R21CVW03WFk2L09mMG5oNy8rV0tJdUltRmhQaGl0aHBUVVk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0NHRUszSlpJaXJIWFBXVkRxaTVPcytYMFdHdTJVdlgzTlJNNnhvR0FHOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidXJCR1JCNDZyWnhrd2d3UzA0MDZBOW5aRk02QTl0UkNHOVFPK2dGQU5rQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlIzdGEzdG1LaXBmekRLM20zV09iWDJBVjc1cFNpY3NCblBKTGo2RjNxdDJ0S1ZCcmZNWlFpWW8zc1QyL1BHQUdxeThiNTh5QjFpOUNHaDNrdldWR0RRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTM1LCJhZHZTZWNyZXRLZXkiOiJxVFB2ZkJlcXFKa1h3ME1Gd0EvTEV2TjZIeWtYVDRpRkR1UDRyUnphU2FNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6ODEzLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6ODEzLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IllMS1gzTU5BIiwibWUiOnsiaWQiOiIyNjA3NjkzNTU2MjQ6ODRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoibXNlbGFjaHVpIiwibGlkIjoiODk0NzAzNzY0Mjg2Nzo4NEBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0o2N2lzNEJFTHk5OTh3R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Im5JT3JvRDdJQ1BYcHFmQ2dDcFIzOE96M1VkWXMya1lxaWNaV2JDRExHajQ9IiwiYWNjb3VudFNpZ25hdHVyZSI6Inh6Uk05dktYU1IwMHFRbE1walN3RFV1eitpclZOdXRoaTkyaEg0VU9RQTJoYlZPTEtXc1FJZlNFL0ZMQ1p2M01mV0h1eWJFYWhNMzZqbkhiU0MrNURRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJmbXBsbWgxNDlGanUzejZSNDJ1Sll6Z3hkZkVpTndyMDJEeHVhRGJvV3dYeXZTWjdnbDVOdTlNdmR5QzI3dlViUzNlVnF5QVQ3WUZOM3NZa09FYTFCUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6Ijg5NDcwMzc2NDI4Njc6ODRAbGlkIiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlp5RHE2QSt5QWoxNmFud29BcVVkL0RzOTFIV0xOcEdLb25HVm13Z3l4bysifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElFZ2dDIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc3MTk1Mzg1OSwibGFzdFByb3BIYXNoIjoiMkc0QW11In0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "false",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "false",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/qyskpc.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || "*",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃",
// add bot namw here for menu
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// true to get auto status react
STICKER_NAME: process.env.STICKER_NAME || "𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "260769355624",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/78gezo.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> I'ᗩᗰ *𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃 🐯*",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "private",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "260769355624",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
