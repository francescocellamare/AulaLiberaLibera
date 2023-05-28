'use strict'

import db from "./index.js"




async function newUser(id, lang){
    const query = !lang ? 'INSERT OR IGNORE INTO users(id) VALUES (?)' : 'INSERT INTO users(id, lang) VALUES (?, ?)'
    const params = !lang ? [id] : [id, lang]

    db.run(query, params, (err, row) => {
        if(err)
            console.log(err)
        else
            console.log(row)
    }) 
}

async function updateUser(id, lang){
    const query = 'UPDATE users SET lang = (?) WHERE id = (?)'
    const params = [lang, id]

    db.run(query, params, (err, row) => {
        if(err)
            console.log(err)
        else
            console.log(row)
    }) 
}

function selectLang(id) {
    return new Promise( (resolve, reject) => {    
        const query = 'SELECT "lang" FROM users WHERE id = (?)'
        const params = [id]
        db.get(query, params, (err, row) => {
            if(err) {
                reject('en');
            }
            else {
                resolve(row);
            }
        })
    })
}

export { newUser, updateUser, selectLang }