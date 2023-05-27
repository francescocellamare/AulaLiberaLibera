"use strict"
import axios from "axios"
import * as cheerio from 'cheerio'
import TelegramBot from "node-telegram-bot-api"

const addr = "https://www.swas.polito.it/dotnet/orari_lezione_pub/RicercaAuleLiberePerFasceOrarie.aspx"
const BOT_TOKEN = '6101207167:AAHh_YywGPOqmqPXWBPbkNKgkAcj69U8Cbk';

function sendMessageToBot(id, availableList) {

    const messageText = `Sono disponibili ${availableList}`;

    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: id,
        text: messageText,
    })
        .then(response => {
            console.log('Message sent successfully:', response.data.result.text);
        })
        .catch(error => {
            console.error('Error sending message:', error.response.data);
        });
}


async function fetchOrari(msg) {
    const response = await axios.get(addr);
    const html = response.data;
    const $ = cheerio.load(html);
    const $selected = $('[id=Pagina_gv_AuleLibere_lbl_AuleLibere_0]').text()
    sendMessageToBot(msg.chat.id, $selected);

    return $selected
}



const bot = new TelegramBot(BOT_TOKEN, { polling: true })

bot.onText(new RegExp('\/ora'), (msg) => {
    const queryResult = fetchOrari(msg)
})

