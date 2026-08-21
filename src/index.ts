import express from 'express';
import type {NextFunction, Request, Response} from "express"
import { error } from "node:console";
import fs from "node:fs/promises";
import path from "node:path";
import cors from 'cors';

const app = express();

app.use(cors());

const PORT = process.env.PORT ?? 3000;




app.use(express.json()); 
app.use(function(req: Request, res: Response, next: NextFunction){
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
})




import estudiantesRouter from './routes/estudiantes.routes.js';
import { cargarDatos } from './routes/estudiantes.routes.js';
app.use('/api/estudiantes', estudiantesRouter);


import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../src/swagger_output.json' with {type: 'json'};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));





app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




// ------- CODIGO OMITIDO PORQUE YA NO SE NECESITA --------------------------------
/* 
interface servidor {
    status: string;
    version: string;
}

const estadoServidor: servidor = {
    status: "Servidor en línea",
    version: "1.0.0"
}; */
/* 
app.get ("/", async function(req: Request, res: Response) {
    res.send(`status: ${estadoServidor.status}, version: ${estadoServidor.version}`);
});
//-----------------------------------------------------------------------------------

*/




// - - - - - - - - - - - - - - ENTREGABLE MARTES - - - - - - - - - - - - -
interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}
/* --------- ESTÁ EN ROUTES -------
let estudiantes: Estudiante[] = [];

// TRAYENDO EL ARCHIVO datos.json PARA USARLO EN LOS ARRAYS
async function cargarDatos() {
    try {
        const ruta = path.resolve("src/datos.json");
        const data = await fs.readFile(ruta, "utf-8");
        estudiantes = JSON.parse(data);
        console.log(`Datos cargados en memoria ${estudiantes.length} estudiantes cargados
            `)
    } catch (error) {
        console.log("No se encontraron estudiantes en la lista o lista vacia");
        estudiantes = [];
    }
}

 */

/* --------- ESTA EN ROUTES --------------------
// ENDPOINT GET -- LEER LOS ESTUDIANTES
app.get ("/api/estudiantes", async function(req: Request, res: Response) {
    const estadoActualEstudiantes = await estudiantes;
    res.json(estadoActualEstudiantes);
});
 */

// ENDPOINT POST -- CREAR LOS ESTUDIANTES
interface crearEstudiante {
    nombre: string;
    email: string;
    bootcamp: string;
}
/* ------------------ ESTA EN ROUTES ------------------------
app.post("/api/estudiantes", function(req: Request<{},{}, crearEstudiante>, res: Response){
    const {nombre, email, bootcamp} = req.body;
    if(!nombre || !email ){
        return (res.status(400).json({ error: "Bad Request"}))
    }
    const nuevoEstudiante:Estudiante = {
        id:estudiantes.length>0
            ? estudiantes.length + 1
            : 1,
        nombre,
        email,
        bootcamp,
    };
    estudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);
})
 */

// ENDPOINT PUT -- ACTUALIZAR LOS ESTUDIANTES
interface actualizarEstudiante {
    nombre: string;
    email: string;
    bootcamp: string;
}

/* -------------------- ESTÁ EN ROUTES --------------------
app.put("/api/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = estudiantes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Not Found" });
  } else {
    const {nombre, email, bootcamp}: actualizarEstudiante =
      req.body;

    estudiantes[index] = {
      id: idBuscado,
      nombre: nombre ?? estudiantes[index]?.nombre,
      email: email ?? estudiantes[index]?.email,
      bootcamp: bootcamp ?? estudiantes[index]?.bootcamp
    };
    res.json(estudiantes[index]);
  }
});
 */


/* ----------------- ESTA EN ROUTES ---------------------------

//ENDPOINT DELETE -- ELIMINAR UN ESTUDIANTE
app.delete("/api/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = estudiantes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Estudiante no encontrado para eliminar" });
  } else {
    estudiantes = estudiantes.filter(
      (e) => e.id !== idBuscado,
    );
    res.json({ mensaje: "ESTUDIANTE ELIMINADO" });
  }
});


 */


// ------------- ESTUDIANTES FILTRADOS --------------
interface estudiantesFiltrados {
  bootcamp?: string;
}

interface idParam {
  id: string;
}

// ---------------------------------------------------------------------------------------
app.get ("/api/status", async function(req: Request, res: Response) {
    const estadoActual = await (`"status": "Servidor en línea", "version": "1.0.0"`);
    res.json(estadoActual);
});


app.get ("/", async function(req: Request, res: Response) {
    res.send(`Bienvenido al servidor de paolo
        . acceda a: http://localhost:3000/api/status
        . o tambien a: http://localhost:3000/api/estudiantes`);
});
/* 
app.listen(PORT, async function() {
    console.log(`AQUI SE ENCUENTRA EL SERVIDOR --> http://localhost:3000/`);
    await cargarDatos();
})
 */

// ---------- EXPORTACIONES --------

export type {Estudiante , crearEstudiante, actualizarEstudiante, estudiantesFiltrados, idParam}