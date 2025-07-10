import mongoose from "mongoose";

const connectBase = async () => {
    const mongoUr="mongodb://localhost:27017/projecto";
    try{
        await mongoose.connect (mongoUr)

    }catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw error;
    }
}


export default connectBase;