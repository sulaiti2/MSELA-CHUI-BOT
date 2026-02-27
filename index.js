/* ============================================================

      ╚═╝     ╚═╝╚══════╝      ╚═══╝  ╚═╝  ╚═╝ ╚════╝ ╚═╝     ╚═╝
   ============================================================ */

// ==================== MEMORY OPTIMIZATION ====================
global.gc = global.gc || (() => {});
let memoryCleanInterval = null;

function setupMemoryOptimization() {
    memoryCleanInterval = setInterval(() => {
        try {
            if (global.gc) {
                global.gc();
            }
            const memoryUsage = process.memoryUsage();
            console.log(`🔄 Memory Cleaned - Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        } catch (err) {
            console.error("Memory cleanup error:", err.message);
        }
    }, 30000);
}

setupMemoryOptimization();

// ==================== ULTRA PRO SPEED BOOSTER ====================
const speedCache = {
    groups: new Map(),
    users: new Map(),
    commands: null,
    lastClean: Date.now()
};

let perfStats = {
    msgCount: 0,
    avgResponse: 0,
    startTime: Date.now()
};

const msgQueue = [];
let processing = false;

const processQueue = async () => {
    if (processing || msgQueue.length === 0) return;
    processing = true;
    
    const batch = msgQueue.splice(0, 2);
    for (const msg of batch) {
        try {
            await handleMessageUltra(msg);
        } catch(e) {}
        await new Promise(r => setTimeout(r, 50));
    }
    
    processing = false;
    if (msgQueue.length > 0) setTimeout(processQueue, 20);
};

setInterval(() => {
    const now = Date.now();
    const mem = process.memoryUsage();
    
    console.log(`
    ⚡ MEMORY STATS ⚡
    🧠 Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(1)}MB
    🗃️  Cache: ${speedCache.groups.size} groups
    📨 Queue: ${msgQueue.length}
    `);
    
    if (mem.heapUsed / 1024 / 1024 > 400) {
        console.log("⚠️ High memory, clearing cache...");
        speedCache.groups.clear();
        speedCache.users.clear();
        msgQueue.length = 0;
    }
    
    if (now - speedCache.lastClean > 120000) {
        for (const [key, val] of speedCache.groups.entries()) {
            if (now - val.timestamp > 180000) speedCache.groups.delete(key);
        }
        speedCache.lastClean = now;
    }
}, 30000);

// ==================== REQUIRED MODULES ====================
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const util = require('util');
const FileType = require('file-type');
const axios = require('axios');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const moment = require('moment');
const speed = require('performance-now');

// ==================== CONFIG ====================
const config = require('./config');
const prefix = config.PREFIX || '.';
const ownerNumber = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',').map(n => n.trim()) : ['260769355624'];

// ==================== COMMAND HANDLER ====================
let commands = [];
const aliases = new Map();

// FIRST LOAD COMMAND.JS
console.log(chalk.blue('\n📁 Loading commands from command.js...'));
try {
    const cmdModule = require('./command');
    
    // Check if it has commands array
    if (cmdModule.commands && Array.isArray(cmdModule.commands)) {
        commands = cmdModule.commands;
        console.log(chalk.green(`✅ Loaded ${commands.length} commands from command.js`));
    } 
    // Check if it exports array directly
    else if (Array.isArray(cmdModule)) {
        commands = cmdModule;
        console.log(chalk.green(`✅ Loaded ${commands.length} commands from command.js (array format)`));
    }
    // Check if it has cmd function
    else if (typeof cmdModule.cmd === 'function') {
        console.log(chalk.yellow('⚠️ command.js has cmd function but no commands array yet'));
        console.log(chalk.yellow('   Commands will be loaded when registered'));
    }
} catch (e) {
    console.log(chalk.red(`❌ Command module error: ${e.message}`));
}

// THEN LOAD PLUGINS
console.log(chalk.blue('\n📁 Loading plugins...'));
const pluginsDir = path.join(__dirname, 'plugins');
if (fs.existsSync(pluginsDir)) {
    const pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    for (const file of pluginFiles) {
        try {
            const pluginPath = path.join(pluginsDir, file);
            delete require.cache[require.resolve(pluginPath)];
            const plugin = require(pluginPath);
            
            // Check various export formats
            if (plugin.commands && Array.isArray(plugin.commands)) {
                commands.push(...plugin.commands);
                console.log(chalk.green(`✅ Loaded plugin: ${file} (${plugin.commands.length} commands)`));
            } else if (Array.isArray(plugin)) {
                commands.push(...plugin);
                console.log(chalk.green(`✅ Loaded plugin: ${file} (${plugin.length} commands)`));
            } else if (typeof plugin === 'function') {
                console.log(chalk.yellow(`⚠️ Plugin ${file} is a function, not adding to commands`));
            }
        } catch (err) {
            console.log(chalk.red(`❌ Error in ${file}: ${err.message}`));
        }
    }
}

// Remove duplicate commands (by pattern)
const uniqueCommands = [];
const seenPatterns = new Set();
commands.forEach(cmd => {
    if (cmd.pattern && !seenPatterns.has(cmd.pattern)) {
        seenPatterns.add(cmd.pattern);
        uniqueCommands.push(cmd);
    }
});
commands = uniqueCommands;

console.log(chalk.green(`\n✅ TOTAL COMMANDS LOADED: ${commands.length}`));

// Build aliases map
commands.forEach(cmd => {
    if (cmd.pattern) {
        if (cmd.alias && Array.isArray(cmd.alias)) {
            cmd.alias.forEach(alias => {
                if (alias) aliases.set(alias.toLowerCase(), cmd.pattern);
            });
        }
    }
});

console.log(chalk.blue(`📊 Total aliases: ${aliases.size}`));

// Show sample commands
if (commands.length > 0) {
    console.log(chalk.yellow('\n📋 Sample Commands:'));
    commands.slice(0, 5).forEach((cmd, i) => {
        console.log(chalk.yellow(`   ${i+1}. ${prefix}${cmd.pattern} - ${cmd.desc || 'No description'}`));
    });
}

// ==================== LIB IMPORTS ====================
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { sms, downloadMediaMessage } = require('./lib/msg');
const GroupEvents = require('./lib/groupevents');
const { AntiDelete, DeletedText, DeletedMedia } = require('./lib/antidel');
const { DATABASE } = require('./lib/database');

// ==================== BAN/SUDO ====================
let banList = [];
let sudoList = [];

try {
    if (fs.existsSync('./lib/ban.json')) {
        banList = JSON.parse(fs.readFileSync('./lib/ban.json'));
    }
} catch (e) {}

try {
    if (fs.existsSync('./lib/sudo.json')) {
        sudoList = JSON.parse(fs.readFileSync('./lib/sudo.json'));
    }
} catch (e) {}

// ==================== TEMP DIR ====================
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            try {
                const stats = fs.statSync(filePath);
                if (now - stats.mtimeMs > 10 * 60 * 1000) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {}
        }
    } catch (err) {}
};

setInterval(clearTempDir, 5 * 60 * 1000);

// ==================== SESSION HANDLER ====================
async function initializeSession() {
    const sessionDir = path.join(__dirname, 'sessions');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    const credsPath = path.join(sessionDir, 'creds.json');
    
    if (config.SESSION_ID && config.SESSION_ID.trim() !== "" && !fs.existsSync(credsPath)) {
        try {
            let sessdata = config.SESSION_ID;
            
            const prefixes = ['FAIZAN-MD~', 'BOSS-MD~', 'EMYOU~', 'BOT~'];
            for (const p of prefixes) {
                if (sessdata.includes(p)) {
                    sessdata = sessdata.split(p)[1];
                    break;
                }
            }
            
            sessdata = sessdata.trim();
            while (sessdata.length % 4 !== 0) {
                sessdata += '=';
            }
            
            const decodedData = Buffer.from(sessdata, 'base64').toString('utf-8');
            
            try {
                const jsonData = JSON.parse(decodedData);
                fs.writeFileSync(credsPath, JSON.stringify(jsonData, null, 2));
                console.log("✅ Session loaded successfully!");
            } catch (jsonErr) {
                fs.writeFileSync(credsPath, decodedData);
            }
        } catch (err) {
            console.error("❌ Session error:", err.message);
        }
    }
}

// ==================== MESSAGE STORE FOR ANTI-DELETE ====================
const messageStore = new Map();

async function storeMessageForAntiDelete(message) {
    try {
        if (!message || !message.key || !message.message) return;
        if (message.key.fromMe) return;
        
        const messageId = message.key.id;
        const now = Date.now();
        
        messageStore.set(messageId, {
            id: messageId,
            key: {
                remoteJid: message.key.remoteJid,
                fromMe: false,
                id: message.key.id,
                participant: message.key.participant
            },
            message: JSON.parse(JSON.stringify(message.message)),
            timestamp: message.messageTimestamp || Math.floor(now / 1000),
            receivedAt: now
        });
        
        if (messageStore.size > 500) {
            const oldestKeys = [...messageStore.keys()].slice(0, 100);
            for (const key of oldestKeys) {
                messageStore.delete(key);
            }
        }
    } catch (err) {}
}

// ==================== ULTRA FAST MESSAGE HANDLER ====================
async function handleMessageUltra(message) {
    perfStats.msgCount++;
    const startTime = Date.now();
    
    try {
        if (!message || !message.message || message.key.fromMe) return;
        
        const type = Object.keys(message.message)[0];
        if (type === 'protocolMessage' || type === 'senderKeyDistributionMessage') return;
        
        const from = message.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        let groupMetadata = null;
        if (isGroup && conn) {
            const cached = speedCache.groups.get(from);
            if (cached && (Date.now() - cached.timestamp < 120000)) {
                groupMetadata = cached.data;
            } else {
                try {
                    groupMetadata = await conn.groupMetadata(from).catch(() => null);
                    if (groupMetadata) {
                        speedCache.groups.set(from, {
                            data: groupMetadata,
                            timestamp: Date.now()
                        });
                    }
                } catch (e) {}
            }
        }
        
        perfStats.avgResponse = Math.round(
            (perfStats.avgResponse * 0.8) + ((Date.now() - startTime) * 0.2)
        );
        
    } catch(error) {}
}

// ==================== MAIN CONNECTION FUNCTION ====================
let conn;

async function connectToWA() {
    console.log("\n📱 ==============================");
    console.log("📱 CONNECTING TO WHATSAPP");
    console.log("📱 ==============================\n");
    
    try {
        await initializeSession();
        
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
        const { version } = await fetchLatestBaileysVersion();
        
        conn = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Firefox"),
            syncFullHistory: false,
            auth: state,
            version,
            markOnlineOnConnect: config.ALWAYS_ONLINE === 'true',
            emitOwnEvents: false,
            fireInitQueries: false,
            retryRequestDelayMs: 100,
            generateHighQualityLinkPreview: true,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });
        
        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log("📱 QR Code received - Scan with WhatsApp");
                qrcode.generate(qr, { small: true });
            }
            
            if (connection === 'connecting') {
                console.log('Connecting to WhatsApp...');
            }
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                console.log(`❌ Connection closed - Status: ${statusCode}`);
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        fs.rmSync('./sessions', { recursive: true, force: true });
                        console.log('⚠️ Session logged out. Please re-authenticate');
                    } catch (error) {
                        console.log(`❌ Error deleting session: ${error.message}`);
                    }
                }
                
                if (shouldReconnect) {
                    console.log('Reconnecting in 5 seconds...');
                    setTimeout(connectToWA, 5000);
                }
            }
            
            if (connection === 'open') {
                console.log('\n✅ Bot connected to whatsapp ✅');
                console.log(`👤 Bot Number: ${conn.user.id.split(':')[0]}`);
                console.log(`📝 Total Commands: ${commands.length}`);
                console.log(`🛡️ Anti-Delete: ${config.ANTI_DELETE === 'true' ? 'ACTIVE' : 'INACTIVE'}`);
                
                setTimeout(() => {
                    let up = `*Hello there User! 👋🏻*\n\n` +
                            `> Bot is now online\n\n` +
                            `- *YOUR PREFIX:* = ${prefix}\n` +
                            `- *Commands:* ${commands.length}\n` +
                            `- *Anti-Delete:* ${config.ANTI_DELETE === 'true' ? '✅' : '❌'}`;
                    
                    conn.sendMessage(conn.user.id, { text: up }).catch(() => {});
                    
                    conn.sendMessage(ownerNumber[0] + '@s.whatsapp.net', {
                        text: `✅ *BOT ACTIVATED*\n\nBot is now online!\nCommands: ${commands.length}\nPrefix: ${prefix}`
                    }).catch(() => {});
                }, 5000);
            }
        });
        
        conn.ev.on('creds.update', saveCreds);

        // ANTI-DELETE HANDLER
        if (config.ANTI_DELETE === 'true') {
            conn.ev.on('messages.update', async updates => {
                for (const update of updates) {
                    if (update.update && update.update.message === null) {
                        try {
                            const deletedMsg = messageStore.get(update.key.id);
                            if (!deletedMsg || !deletedMsg.message) continue;
                            
                            const chatId = update.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const deleter = update.key.participant || chatId;
                            
                            const targetJid = ownerNumber[0] + '@s.whatsapp.net';
                            
                            const alertText = `🗑️ *DELETED MESSAGE*\n` +
                                             `Type: Message\n` +
                                             `Deleted by: @${deleter.split('@')[0]}`;
                            
                            await conn.sendMessage(targetJid, {
                                text: alertText,
                                mentions: [deleter]
                            }).catch(() => {});
                            
                        } catch (err) {}
                    }
                }
            });
        }

        // ANTI CALL
        if (config.ANTI_CALL === 'true') {
            conn.ev.on("call", async (json) => {
                try {
                    const call = json.find(c => c.status === 'offer');
                    if (call) {
                        await conn.rejectCall(call.id, call.from);
                    }
                } catch (err) {}
            });
        }

        // GROUP EVENTS
        conn.ev.on("group-participants.update", async (update) => {
            try {
                await GroupEvents(conn, update);
            } catch (err) {}
        });

        // ==================== FIXED MESSAGE HANDLER ====================
        conn.ev.on('messages.upsert', async (mekData) => {
            try {
                const message = mekData.messages[0];
                if (!message || !message.message) return;
                
                // Handle ephemeral messages
                if (getContentType(message.message) === 'ephemeralMessage') {
                    message.message = message.message.ephemeralMessage.message;
                }
                
                // Auto read
                if (config.READ_MESSAGE === 'true') {
                    await conn.readMessages([message.key]).catch(() => {});
                }
                
                // Handle view once
                if (message.message.viewOnceMessageV2) {
                    message.message = message.message.viewOnceMessageV2.message;
                }
                
                // Store for anti-delete
                if (config.ANTI_DELETE === 'true') {
                    await storeMessageForAntiDelete(message);
                }
                
                const from = message.key.remoteJid;
                
                // Handle status
                if (message.key && message.key.remoteJid === 'status@broadcast') {
                    if (config.AUTO_STATUS_SEEN === "true") {
                        await conn.readMessages([message.key]).catch(() => {});
                    }
                    return;
                }
                
                // Serialize message
                const m = sms(conn, message);
                
                // Check if user is banned
                const sender = m.sender || message.key.participant || message.key.remoteJid;
                if (banList.includes(sender)) return;
                
                // Check if user is sudo/owner
                const senderNumber = sender.split('@')[0];
                const isOwner = ownerNumber.includes(senderNumber);
                const isSudo = sudoList.includes(sender);
                const isCreator = isOwner || isSudo;
                
                // Get message text
                let body = m.text || '';
                
                // ========== COMMAND HANDLER - FIXED ==========
                const isCmd = body.startsWith(prefix);
                
                if (isCmd && commands.length > 0) {
                    // Extract command name
                    const cmdName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
                    
                    // Find command by pattern
                    let cmd = commands.find(c => c.pattern && c.pattern.toLowerCase() === cmdName);
                    
                    // Check aliases if not found
                    if (!cmd) {
                        const aliasPattern = aliases.get(cmdName);
                        if (aliasPattern) {
                            cmd = commands.find(c => c.pattern && c.pattern.toLowerCase() === aliasPattern);
                        }
                    }
                    
                    if (cmd) {
                        // Command react
                        if (cmd.react) {
                            conn.sendMessage(from, { 
                                react: { text: cmd.react, key: message.key } 
                            }).catch(() => {});
                        }
                        
                        // Check owner only commands
                        if (cmd.fromMe === true && !isCreator) {
                            return conn.sendMessage(from, { 
                                text: '❌ This command is only for the bot owner!' 
                            }, { quoted: message });
                        }
                        
                        // Execute command
                        try {
                            const args = body.slice(prefix.length + cmdName.length).trim().split(' ');
                            const q = args.join(' ');
                            
                            // Prepare context
                            const context = {
                                from,
                                quoted: message,
                                body,
                                isCmd,
                                command: cmdName,
                                args,
                                q,
                                text: q,
                                isGroup: from.endsWith('@g.us'),
                                sender,
                                senderNumber,
                                botNumber: conn.user.id.split(':')[0],
                                pushname: m.pushName || 'User',
                                isMe: sender === conn.user.id,
                                isOwner,
                                isCreator,
                                reply: (text) => {
                                    return conn.sendMessage(from, { text }, { quoted: message });
                                }
                            };
                            
                            // Add group metadata if in group
                            if (from.endsWith('@g.us')) {
                                try {
                                    const groupMetadata = await conn.groupMetadata(from).catch(() => null);
                                    if (groupMetadata) {
                                        context.groupMetadata = groupMetadata;
                                        context.groupName = groupMetadata.subject;
                                        context.participants = groupMetadata.participants;
                                        context.groupAdmins = getGroupAdmins(groupMetadata.participants || []);
                                        context.isAdmins = context.groupAdmins.includes(sender);
                                        context.isBotAdmins = context.groupAdmins.includes(conn.user.id);
                                    }
                                } catch (e) {}
                            }
                            
                            // Execute command function
                            await cmd.function(conn, message, m, context);
                            
                        } catch (e) {
                            console.error(`❌ Command error (${cmdName}):`, e.message);
                            conn.sendMessage(from, { 
                                text: `❌ Error: ${e.message}` 
                            }, { quoted: message }).catch(() => {});
                        }
                    }
                }
                
            } catch (err) {
                console.error("❌ Message processing error:", err.message);
            }
        });

        // Helper functions
        conn.decodeJid = jid => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
            } else return jid;
        };

        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            let mime = '';
            let res = await axios.head(url);
            mime = res.headers['content-type'];
            if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
            }
            let type = mime.split("/")[0] + "Message";
            if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
            }
        };

        conn.getFile = async(PATH, save) => {
            let res;
            let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
            let type = await FileType.fromBuffer(data) || {
                mime: 'application/octet-stream',
                ext: '.bin'
            };
            let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext);
            if (data && save) fs.promises.writeFile(filename, data);
            return {
                res,
                filename,
                size: await getSizeMedia(data),
                ...type,
                data
            };
        };

        conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
            let types = await conn.getFile(PATH, true);
            let { filename, size, ext, mime, data } = types;
            let type = '', mimetype = mime, pathFile = filename;
            if (options.asDocument) type = 'document';
            if (options.asSticker || /webp/.test(mime)) {
                let { writeExif } = require('./exif.js');
                let media = { mimetype: mime, data };
                pathFile = await writeExif(media, { packname: config.STICKER_NAME || 'BOT', author: config.OWNER_NAME || 'OWNER', categories: options.categories ? options.categories : [] });
                await fs.promises.unlink(filename);
                type = 'sticker';
                mimetype = 'image/webp';
            } else if (/image/.test(mime)) type = 'image';
            else if (/video/.test(mime)) type = 'video';
            else if (/audio/.test(mime)) type = 'audio';
            else type = 'document';
            await conn.sendMessage(jid, {
                [type]: { url: pathFile },
                mimetype,
                fileName,
                ...options
            }, { quoted, ...options });
            return fs.promises.unlink(pathFile);
        };

        conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
            let list = [];
            for (let i of kon) {
                list.push({
                    displayName: await conn.getName(i + '@s.whatsapp.net').catch(() => i),
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${i}\nTEL;type=CELL;type=VOICE;waid=${i}:+${i}\nEND:VCARD`,
                });
            }
            conn.sendMessage(jid, {
                contacts: {
                    displayName: `${list.length} Contact`,
                    contacts: list,
                },
                ...opts,
            }, { quoted });
        };
        
        conn.serializeM = mek => sms(conn, mek);

        return conn;
        
    } catch (err) {
        console.error("❌ Connection error:", err.message);
        setTimeout(connectToWA, 5000);
    }
}

// ==================== EXPRESS SERVER ====================
const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

app.get("/", (req, res) => {
    const mem = process.memoryUsage();
    res.send(`
        <html>
            <head>
                <title>WHATSAPP BOT</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
                    .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .status { color: green; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🤖 WHATSAPP BOT</h1>
                    <p>Status: <span class="status">✅ ONLINE</span></p>
                    <p>Commands: <strong>${commands.length}</strong></p>
                    <p>Memory: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB</p>
                    <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
                </div>
            </body>
        </html>
    `);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`\n🌐 Server listening on port ${port}`);
});

// ==================== START BOT ====================
setTimeout(() => {
    connectToWA();
}, 5000);

// ==================== PROCESS HANDLERS ====================
process.on('SIGINT', () => {
    console.log('Cleaning up before exit...');
    if (memoryCleanInterval) clearInterval(memoryCleanInterval);
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection');
});

console.log("\n🚀 ==============================");
console.log("🚀 BOT STARTING...");
console.log("🚀 ==============================\n");

module.exports = {
    commands,
    aliases,
    prefix,
    ownerNumber,
    config,
    conn
};
