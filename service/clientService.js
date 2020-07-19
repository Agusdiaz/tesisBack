var conMysql = require('../mysqlConnection');
var bcrypt = require('bcrypt'); 

exports.createClient = (client, callback) => {
    let hashedPassword = bcrypt.hashSync(toString(client.contraseña), process.env.BCRYPT_ROUNDS || 10)
    const sql = 'INSERT INTO cliente (mail, nombre, apellido, contraseña) VALUES ?';
    var values = [
        [client.mail, client.nombre, client.apellido, hashedPassword]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateClient = (client, callback) => {
    const sql = 'SELECT * FROM cliente WHERE mail = ?';
    conMysql.query(sql, [client.mail], (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.validateUser = (user, callback) => {
    const sql = 'SELECT * FROM cliente WHERE mail = ?';
    conMysql.query(sql, [user.mail], (err, result) => {
        if (err)
            callback(err)
        else {
            if (result.length == 0) {
                const sql = 'SELECT * FROM local WHERE mail = ?';
                conMysql.query(sql, [user.mail], (err, result) => {
                    if (err)
                        callback(err)
                    else {
                        callback(null, result)
                    }
                })
            }
            else
                callback(null, result)
        }
    })
}

exports.updateClient = (client, callback) => {
    const sql = 'UPDATE cliente SET nombre= ?, apellido= ?, contraseña= ? WHERE mail= ?';
    var values = [client.nombre, client.apellido, client.contraseña, client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}