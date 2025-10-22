const sqlite3 = require('sqlite3').verbose();

var db;

function connect(){
    db = new sqlite3.Database('./database/prefSet.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
    });
}

function close(){
    db.close();
}

function register(pref) {
    db.serialize(() => {
        db.each(`SELECT count(*) FROM prefset WHERE list = ${pref};` )
    })
}