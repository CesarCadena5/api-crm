import { connect } from "mongoose";
import 'dotenv/config';

export const conexion = async () => {
    try {
        await connect('mongodb+srv://usuario_1:5Aguademar@atlascluster.fbnxshk.mongodb.net/CRM_TIENDA');
        console.log('db conectada');
    } catch (error) {
        throw new Error(error.message);
    };
};