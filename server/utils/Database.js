const mysql = require('mysql');
let dbConfig = {
    host: 'us-cdbr-iron-east-04.cleardb.net', //localhost us-cdbr-iron-east-04.cleardb.net
    user: 'bc99c51f80ea0b',// root bc99c51f80ea0b
    password: 'heroku_436891b58c83c67',//root 5afe21fc
    database: 'heroku_436891b58c83c67', //pk heroku_436891b58c83c67
};

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-iron-east-04.cleardb.net', //localhost
    user: 'bc99c51f80ea0b',// root
    password: '5afe21fc',//root
    database: 'heroku_436891b58c83c67', //pk
});

module.exports = class Database {
    constructor(config = dbConfig) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
};
