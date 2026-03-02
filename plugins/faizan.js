const { cmd } = require("../command");
const os = require("os");

cmd({
    pattern: "chui",
    alias: ["chui"],
    desc: "chui full introduction",
    category: "info",
    react: "🐯",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {

        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);

        const text = `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│ ╌─̇─̣⊰ 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃 _³⁰³_ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 👤 *Name:* mselachui 
│❀ 🧑‍💼 *Nick:* 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃
│❀ 🎂 *Age:* 20
│❀ 🧬 *Caste:* KINGᴀʙǫɪ
│❀ 🌍 *Country:* Tanzania 🇹🇿
│❀ 🏙️ *City:* (UYOLE MBEYA TZ)
│
│❀ 🤖 *Bot Name:* 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃
│❀ 👑 *Owner:* mselachui
│❀ 📞 *Owner No:* +260769355624
│❀ 🔣 *Prefix:* .
│❀ ⚙️ *Mode:* ᴘᴜʙʟɪᴄ
│❀ 🔌 *Baileys:* ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ
│
│❀ ⏳ *Uptime:* ${h}h ${min}m ${sec}s
│❀ 💻 *Platform:* ${os.platform()}
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ *𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃*
`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
