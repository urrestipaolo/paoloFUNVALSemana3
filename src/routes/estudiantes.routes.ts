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

/*
// ENDPOINT GET -- LEER LOS ESTUDIANTES
router.get ("/", async function(req: Request, res: Response) {

    #swagger.tags = ['LISTA DE LOS ESTUDIANTES']
    #swagger.summary = 'PODER VER A TODOS LOS ESTUDIANTES'
    #swagger.responses[200] = {
      description: 'ESTUDIANTES',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            titulo: { type: 'string', example: 'programacion' },
            duracionSemanas: { type: 'number', example: 16 },
            publicado: { type: 'boolean', example: true }
          }
        }
      }
    }

    const estadoActualEstudiantes = await estudiantes;
    res.json(estadoActualEstudiantes);
});
*/


// ENDPOINT LISTA Y BOOTCAMP JUNTOS (ARREGLADO)
router.get('/', (req: Request, res: Response) => {
  /*
  #swagger.tags = ['LISTA DE ESTUDIANTES']
    #swagger.summary = 'PODER ENCONTRAR A UN ESTUDIANTE POR SU BOOTCAMP'
    #swagger.parameters['bootcamp'] = {
      in: 'query',
      description: 'Filtrar por bootcamp',
      required: false,
      type: 'string'
    }
*/
  const { bootcamp } = req.query;
  let resultado = [...estudiantes];
  if (bootcamp && typeof bootcamp === 'string') {
    resultado = resultado.filter(
      (e) => e.bootcamp.toLowerCase() === bootcamp.toLowerCase()
    );
  }
  return res.json(resultado);

});





// ENDPOINT POST -- CREAR LOS ESTUDIANTES
router.post("", function(req: Request<{},{}, crearEstudiante>, res: Response){
  /*
    #swagger.tags = ['LISTA DE ESTUDIANTES']
    #swagger.summary = 'CREAR A UN ESTUDIANTE'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'INGRESE ESTA INFORMACION PARA PODER CREAR A UN ESTUDIANTE',
      required: true,
      schema: {
        $nombre: "Ernesto De la Cruz",
        $email: "cualquiera@gmail.com"
        &bootcamp: "Tester"
      }
    }
  */
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
  /*
      #swagger.tags = ['LISTA DE ESTUDIANTES']
      #swagger.summary = 'ACTUALIZAR A UN ESTUDIANTE DE LA LISTA'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'SE NECECITA LA ID DEL ESTUDIANTE PARA ACTUALIZAR',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'INGRESE LA INFORMACION A ACTUALIZAR DE LA SIGUIENTE MANERA',
        required: true,
        schema: {
          nombre: "Jose De la Cruz",
          email: "otroactualizado@gmail.com",
          boomcamp: "developer"
        }
      }
    */
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
  /*
    #swagger.tags = ['LISTA DE ESTUDIANTES']
    #swagger.summary = 'ELIMINAR A UN ESTUDIANTE POR BOBITO'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'SE DEBE INGRESAR LA ID DEL ESTUDIANTE A ELIMINAR ¡CUIDADO! UNA VEZ HECHO NO HAY VUELTA ATRAS',
      required: true,
      type: 'integer'
    }
  */
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
/*router.get(
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
*/

// --------------- BUSQUEDA POR EL ID
router.get("/:id", function (req: Request<idParam>, res: Response) {
// #swagger.tags = ['LISTA DE ESTUDIANTES POR ID']
  // #swagger.description = 'Buscar a un estudiante por su ID'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'Buscar ID del estudiante',
          required: true,
          type: 'integer'
  } */
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

