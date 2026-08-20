// IMPORTACIONES

import { Router } from 'express';
import type { Estudiante, crearEstudiante, actualizarEstudiante, estudiantesFiltrados, idParam} from '../index.js';
import type {NextFunction, Request, Response} from "express"
import fs from "node:fs/promises";
import path from "node:path";


const router = Router();




// las rutas van aquí
//--------------------- PROPIO DE LAS ROUTES --------------------------

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


// ENDPOINT GET -- LEER LOS ESTUDIANTES
router.get ("", async function(req: Request, res: Response) {
    const estadoActualEstudiantes = await estudiantes;
    res.json(estadoActualEstudiantes);
});


// ENDPOINT POST -- CREAR LOS ESTUDIANTES
router.post("", function(req: Request<{},{}, crearEstudiante>, res: Response){
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



// ENDPOINT PUT -- ACTUALIZAR LOS ESTUDIANTES
router.put("/:id", function (req: Request, res: Response) {
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



//ENDPOINT DELETE -- ELIMINAR UN ESTUDIANTE
router.delete("/:id", function (req: Request, res: Response) {
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


// ---------------- FILTRADO -----------------------

// ---------------- BUSQUEDA POR BOOTCAMP (NO FUNCIONÓ XD) ------------
router.get(
  "/",
    function (req: Request<{}, {}, {}, estudiantesFiltrados>, res: Response) {
        const { bootcamp } = req.query;
        let resultado = [...estudiantes];

    if (bootcamp) {
      resultado = resultado.filter(
        (e) => e.bootcamp.toLowerCase() === bootcamp.toLowerCase(),
      );
    }

  return res.json(resultado);
});


// --------------- BUSQUEDA POR EL ID
router.get("/:id", function (req: Request<idParam>, res: Response) {
  const idBuscado = Number(req.params.id); //Number("juan") === 32

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "debe ser un id valido" });
  }
  const estudianteFiltrado = estudiantes.find(
    (e) => e.id === idBuscado,
  );

  if (!estudianteFiltrado) {
    return res
      .status(404)
      .json({ error: "no se ha encontrado el estudiante" });
  }
  return res.json(estudianteFiltrado);
});





// EXPORTACIONES
export default router;
export {cargarDatos};

