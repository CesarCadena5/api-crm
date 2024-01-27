import { connect } from "mongoose";
import 'dotenv/config';

export const conexion = async () => {
    try {
        await connect(process.env.COMPASS_CONNECTION);
        console.log('db conectada');
    } catch (error) {
        throw new Error(error.message);
    };
};