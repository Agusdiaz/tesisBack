var conMysql = require('../mysqlConnection');
var bcrypt = require('bcrypt');

exports.createClient = (client, callback) => {
    this.validateMail(client, (error, result) => {
        if (error)
            callback(error);
        else {
            if (result[0].length > 0 || result[1].length > 0) {
                callback(null, result)
            }
            else {
                let hashedPassword = bcrypt.hashSync(client.contraseña.toString(), process.env.BCRYPT_ROUNDS || 10)
                const sql = 'INSERT INTO cliente (mail, nombre, apellido, contraseña) VALUES ?'
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
        }
    })
}

exports.validateMail = (user, callback) => {
    const sql = 'SELECT * FROM local WHERE mail= ?; SELECT * FROM cliente WHERE mail= ?;'
    conMysql.query(sql, [user.mail, user.mail], (err, result) => {
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
                const sql = 'SELECT * FROM local WHERE mail = ? AND habilitado = 1';
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
    const sql = 'UPDATE cliente SET nombre= ?, apellido= ? WHERE mail= ?';
    var values = [client.nombre, client.apellido, client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateClientPassword = (user, callback) => {
    let hashedPassword = bcrypt.hashSync(user.contraseña.toString(), process.env.BCRYPT_ROUNDS || 10)
    const sql = 'UPDATE cliente SET contraseña= ? WHERE mail= ?';
    var values = [hashedPassword, user.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}