const sqlite3 = require('sqlite3').verbose();

var db;

function connect(){
    db = new sqlite3.Database('./database/stats.db', sqlite3.OPEN_READWRITE, (err) => {
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

function getDate(code){
    const record = [];
    db.serialize(() => {
        db.each("SELECT date FROM lastFetch", (err, row) => {
            record.push(row);
        });
    });
    return record[0];
}

module.exports = {
    connect,
    close,
    getDate
}