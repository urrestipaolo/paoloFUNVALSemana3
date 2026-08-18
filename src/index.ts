import express from 'express';
import type {Request, Response} from "express"

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


interface servidor {
    status: string;
    version: string;
}

const estadoServidor: servidor = {
    status: "Servidor en línea",
    version: "1.0.0"
};
/* 
app.get ("/", async function(req: Request, res: Response) {
    res.send(`status: ${estadoServidor.status}, version: ${estadoServidor.version}`);
});

 */
app.get ("/", async function(req: Request, res: Response) {
    const estadoActual = await (`status: ${estadoServidor.status}, version: ${estadoServidor.version}`);
    res.json(estadoActual);
});