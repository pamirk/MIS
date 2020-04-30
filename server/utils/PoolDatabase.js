const mysql = require('mysql');

/*const configDB =
    process.env.NODE_ENV === "production"
        ? {
            connectionLimit: 10,
            host: 'us-cdbr-iron-east-04.cleardb.net', //localhost us-cdbr-iron-east-04.cleardb.net
            user: 'bc99c51f80ea0b',// root bc99c51f80ea0b
            password: '5afe21fc',//root 5afe21fc
            database: 'heroku_436891b58c83c67', //pk heroku_436891b58c83c67
        }
        : {
            connectionLimit: 10,
            host: 'localhost', //localhost us-cdbr-iron-east-04.cleardb.net
            user: 'root',// root bc99c51f80ea0b
            password: 'root',//root 5afe21fc
            database: 'pk', //pk heroku_436891b58c83c67
        };*/
const configDB =
    {
        connectionLimit: 10,
        host: 'us-cdbr-iron-east-04.cleardb.net', //localhost us-cdbr-iron-east-04.cleardb.net
        user: 'bc99c51f80ea0b',// root bc99c51f80ea0b
        password: '5afe21fc',//root 5afe21fc
        database: 'heroku_436891b58c83c67', //pk heroku_436891b58c83c67
    };
module.exports = class Database {
    constructor() {
        this.pool = mysql.createPool(configDB);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) return reject(err); // not connected!
                    connection.query(sql, args, (err, rows) => {
                    connection.release();
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
};
