import express from 'express';
import morgan from 'morgan';
import cors from 'cors'; 
import authRoutes from './routes/auth.routers';
import connectBase from './config/db';

const app = express();
const port = 3000;

// 🟢 CONFIGURAR CORS ANTES DE LAS RUTAS
app.use(cors({
  origin: 'http://localhost:5173', // frontend en Vite
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

// 🛑 QUITAR EL PRIMER app.listen (estaba duplicado)
connectBase().then(() => {
  app.listen(port, () => {
    console.log(`✅ El servidor está corriendo en el puerto: ${port}`);
  });
});
