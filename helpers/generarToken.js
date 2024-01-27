import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generarToken = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, 'MyS3cr37Keyt0K3N', {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) reject('Hubo un error al generar el token');
            resolve(token);
        });
    });
};