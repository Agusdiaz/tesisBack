const ShopService = require('../service/shopService');

exports.getClientFavourites = (req, res) => {
    ShopService.getFavourites(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar favoritos')
        }
        else if (result.length == 0) {
            return res.status(204).send('Cliente sin favoritos')
        }
        else
            return res.json(result)
    })
}

exports.getAllShopsOpenClose = (req, res) => {
    ShopService.getAllShopsOpenClose((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay locales')
        }
        else
            return res.json(result)
    })
}

exports.getAllShopsAZ = (req, res) => {
    ShopService.getAllShopsAZ((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay locales')
        }
        else
            return res.json(result)
    })
}

exports.getShopByName = (req, res) => {
    ShopService.getShopByName(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar local por nombre')
        }
        else if (result.length == 0) {
            return res.status(204).send('No existen locales con ese nombre')
        }
        else
            return res.json(result)
    })
}

exports.getShopByAddress = (req, res) => {
    ShopService.getShopByAddress(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar local por dirección')
        } 
        else if (result.length == 0) {
            return res.status(204).send('No existen locales con esa dirección')
        }
        else
            return res.json(result)
    })
}

exports.setShop = (req, res) => {
    ShopService.updateShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Local no encontrado')
        }
        else
            return res.send('Local actualizado')
    })
}