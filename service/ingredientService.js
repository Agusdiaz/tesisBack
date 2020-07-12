var conMysql = require('../mysqlConnection');

exports.getShopDisabledIngredients = (shop, callback) => {
    const sql = 'SELECT nombre, precio, detalle FROM ingrediente WHERE local = ? AND disponible = 0;';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateDisabledIngredient = (ingredient, callback) => {
    const sql = 'UPDATE ingrediente SET disponible = 1 WHERE id = ?';
    var values = [ingredient.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}