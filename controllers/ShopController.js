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

exports.setShopAsFavourite = (req, res) => {
    ShopService.createShopAsFavourite(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar local como favorito')
        }
        else
            return res.send('Local guardado como favorito')
    })
}

exports.deleteShopAsFavourite = (req, res) => {
    ShopService.deleteShopAsFavourite(req.body, (error, result) => {
        console.log(result)
        if (error) {
            console.log(error)
            return res.status(500).send('Error al eliminar local como favorito')
        }
        else if (result.affectedRows == 0) {
            return res.status(204).send('Cliente no tiene local como favorito')
        }
        else
            return res.send('Local eliminado como favorito')
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

exports.setShopDelay = (req, res) => {
    ShopService.updateDelayShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar demora del local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Local no encontrado')
        }
        else
            return res.send('Demora del local actualizada')
    })
}