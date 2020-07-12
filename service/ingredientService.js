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

exports.updateIngredientStatus = (ingredient, callback) => {
    const sql = 'UPDATE ingrediente SET disponible = ? WHERE id = ?';
    var values = [ingredient.disponible, ingredient.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}