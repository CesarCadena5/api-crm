export const validarImagen = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            msg: 'La imagen, es requerida',
            icon: 'error'
        });
    }

    const imagen = req.file;
    if (imagen && (imagen.mimetype !== 'image/jpeg' && imagen.mimetype !== 'image/png')) {
        return res.status(415).json({
            msg: 'La imagen no cumple con la extensión permitida [jpg, png]',
            icon: 'error'
        });
    }

    if (imagen && (imagen.size / 1024 > 3072)) {
        return res.status(423).json({
            msg: 'El peso de la imagen, supera los 3MB',
            icon: 'error'
        });
    }
    next();
};