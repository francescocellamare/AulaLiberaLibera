"use strict"
import axios from "axios"
import * as cheerio from 'cheerio'
import TelegramBot from "node-telegram-bot-api"

const addr = "https://www.swas.polito.it/dotnet/orari_lezione_pub/RicercaAuleLiberePerFasceOrarie.aspx"
const BOT_TOKEN = '6101207167:AAHh_YywGPOqmqPXWBPbkNKgkAcj69U8Cbk';
const setOfRooms = ["1", "10", "10A", "10C", "10D", "10I", "11", "11B", "11I", "11S", "11T", "12", "12A", "12D", "12I", "13", "13A", "13B", "13S", "14", "15", "15A", "16", "17", "17A", "19", "19A", "1B", "1I", "1M", "1P", "1S", "2", "21A", "27", "27B", "29", "29B", "2C", "2D", "2I", "2M", "2N", "2P", "3", "3I", "3M", "3N", "3P", "3S", "4", "4C", "4D", "4I", "4M", "4N", "4P", "4T", "5", "5B", "5I", "5M", "5N", "5S", "6", "6C", "6D", "6I", "6N", "7", "7B", "7I", "7N", "7S", "7T", "8", "8C", "8D", "8I", "9B", "9I", "9S", "9T", "R1", "R1b", "R2", "R2b", "R3", "R3b", "R4", "R4b"]
const noSlot = 8
let borraccia = 0

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

function sendMessageToBot(id, message) {

    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: id,
        text: message,
    })
        .then(response => {
            console.log('Message sent successfully to :', id);
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
}

function maxAvail(pos, availability){
    let i = pos
    while (availability[i]) 
        i++
    return i
}

async function fetchOrari() {
    const response = await axios.get(addr);
    const html = response.data;
    return html
}

function getRooms(html, index) {
    const $ = cheerio.load(html);
    const $selected = $(`[id=Pagina_gv_AuleLibere_lbl_AuleLibere_${index}]`)
                            .text().split(', ').map(room => room.trim())
    return $selected
}


//  -------------------------------------------- BOT request ------------------------------------------------

bot.onText(new RegExp('\/now'), async (msg) => {
    const index = 0
    const html = await fetchOrari()
    const queryResult = getRooms(html, index)

    const message = queryResult.length === 0 ? 'No rooms' : queryResult.join(', ');
    sendMessageToBot(msg.chat.id, message);
})

bot.onText(new RegExp('\/next'), async (msg) => {
    const index = 1
    const html = await fetchOrari()
    const queryResult = getRooms(html, index)

    const message = queryResult.length === 0 ? 'No rooms' : queryResult.join(', ');
    sendMessageToBot(msg.chat.id, message);
})

bot.onText(new RegExp('\/best'), async (msg) => {
    let bitmap = {}
    let slots = {}
    for(let room of setOfRooms) {
        bitmap[room] = []
        slots[room] = 0
    }
    
    const html = await fetchOrari()
    for(let i = 0; i < noSlot; i++) {
        let currentAvailable = getRooms(html, i)
        for(let room in bitmap) {
            if(currentAvailable.includes(room))
                bitmap[room].push(1)
            else
                bitmap[room].push(0)
        }
    }
    for(let room in slots) {
        slots[room] = maxAvail(0, bitmap[room])
    }
    const maxFree = Math.max(...Object.values(slots))
    let result = []
    for(let room in slots) {
        if(slots[room] == maxFree)
            result.push(room)
    }
    
    sendMessageToBot(msg.chat.id, result.toString());
})

bot.onText(new RegExp('\/AESA'), async (msg) => {
    const html = await fetchOrari()
    const queryResult = getRooms(html, 0)
    let message = 'Oggi non hanno prenotato'
    if(queryResult.includes('7I'))
        message = 'AESA TI ASPETTA'
    
    sendMessageToBot(msg.chat.id, message);
})

bot.onText(new RegExp('\/caduta'), async (msg) => {
    borraccia++
    const message = `Numero di borracce cadute: ${borraccia}`
    
    sendMessageToBot(msg.chat.id, message);
})

bot.onText(new RegExp('\/quante'), async (msg) => {
    const message = `Numero di borracce cadute: ${borraccia}`
    
    sendMessageToBot(msg.chat.id, message);
})