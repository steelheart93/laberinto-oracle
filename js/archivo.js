/**
 * Programa que controla la interacción del usuario y la base de datos, para la creación de un Laberinto.
 * @autor Stiven Muñoz Murillo
 * @version 01/03/2019
 */

$(function () {
    var inicial = false;
    var final = false;

    $("#cargar").click(function () {
        NOMBRE = document.getElementById("nombre").value;
        //cargar_laberinto();

        consultar();

        // Reproducir audio precargado en  el index.html
        document.getElementById("audio_cargar").play();
    });

    $("#coordenada_inicial").click(function () {
        if (inicial) {
            // Se deben reiniciar las condiciones
            inicial = false;
            final = false;

            // Si ya se cargo una coordenada inicial vuelvo
            // a comenzar con las mismas dimensiones
            cargar_laberinto();
            // y cargo la nueva coordenada
            this.click();
        } else {
            inicial = true;
            X1 = document.getElementById("coordenada_x").value;
            Y1 = document.getElementById("coordenada_y").value;
            id_actual = `c(${X1},${Y1})`;
            document.getElementById(id_actual).src = "includes/img/rpg_maker/toro.png";
        }

        // Reproducir audio precargado en  el index.html
        document.getElementById("audio_iniciar").play();
    });

    $("#toggle").click(function () {
        location.href = "http://localhost/laberinto_oracle/index.html";
    });
});

// Dimensiones
var NOMBRE = "";

// Coordenada inicial
var X1 = 0;
var Y1 = 0;

// Coordenada final
var X2 = 0;
var Y2 = 0;

// Posición actual de la cabeza del Minotauro
var id_actual = "c(0,0)";

// Se llego al final del laberinto
var camino_finalizado = false;

function consultar() {
    var consultaJSON = { "NOMBRE": NOMBRE };
    // alert(JSON.stringify(consultaJSON));

    var promesa = $.get("../php/archivo.php", consultaJSON);

    promesa.done(function (respuesta) {
        console.log(respuesta);
        var respuestaJSON = JSON.parse(respuesta);
        console.log(respuestaJSON);

        // Si no hay errores, comienzo el recorrido
        if (respuestaJSON["ERRORES"] == "SI") {
            alert("¡Se encontraron Errores!");
            // Muestro el mensaje de error de la BD
            console.log(respuestaJSON["MENSAJE"]);
        } else {
            var mensaje = respuestaJSON["MENSAJE"];
            var filas = mensaje.split("-");
            var ANCHO = 0;

            // Elimino el último elemento
            filas.pop();

            // Obtengo el elemento identificado como tabla
            var tabla = document.getElementById("tabla");

            // Borro su contenido
            tabla.innerHTML = "";

            // Hago un primer ciclo para crear y recorrer 
            // las filas de la tabla según el ALTO
            console.log(filas);
            for (let y = 0; y < filas.length; y++) {
                // Creo un elemento tr (table row)
                var tr = document.createElement("tr");

                // En la primera columna de cada fila
                var td = document.createElement("td");
                // Almaceno la guardo posición de dicha fila
                td.innerHTML = `<p>${y} &nbsp;</p>`;
                // Y agrego es primera columna a la tabla
                tr.appendChild(td);

                // Hago un segundo ciclo para crear y recorrer las columnas 
                // de la tabla según el ANCHO en cada fila
                var columnas = filas[y].split(";");
                ANCHO = columnas.length;
                for (let x = 0; x < columnas.length; x++) {
                    // Creo un elemento td (colummna tabla - fila)
                    var td = document.createElement("td");

                    var img;
                    if (columnas[x] == "1") {
                        // Los bordes de la tabla con espacios
                        img = `<img id='c(${x},${y})' src="../includes/img/rpg_maker/espacio.png">`;
                    } else if (columnas[x] == "0") {
                        // El resto de la tabla son paredes
                        img = `<img id='c(${x},${y})' src="../includes/img/rpg_maker/pared.png">`;
                    } else {
                        img = `<img id='c(${x},${y})' src="../includes/img/rpg_maker/cerrada.png">`;
                    }

                    // Cada columna de cada fila guarda un botón que informa
                    // su posición a la función coordenada y almacena una imagen
                    td.innerHTML = `<button onclick='coordenada(${x},${y})'>${img}</button>`;

                    // Agrego las columnas a la fila actual
                    tr.appendChild(td);
                }

                // Almaceno la fila actual con sus respectivas columnas
                // y procedo a seguir cargando la información del resto
                // de filas, hasta que el ciclo termine
                tabla.appendChild(tr);
            }

            // Creo una nueva fila
            var tr = document.createElement("tr");
            // Creo un nuevo elemento columna de fila
            var td = document.createElement("td");
            // Almaceno un espacio en blanco al 
            // inicio de esta última fila
            td.innerHTML = `<p> </p>`;
            // Agrego dicho espacio en blanco a la fila
            tr.appendChild(td);

            // Sigo agregando información a la misma fila
            for (let x = 0; x < ANCHO; x++) {
                // Agrego la posición en el eje x
                // a esta última fila
                var td = document.createElement("td");
                td.innerHTML = `<p>${x}</p>`;
                tr.appendChild(td);
            }

            // Agrego la última fila de la tabla.
            tabla.appendChild(tr);
        }
    });

    promesa.fail(function (respuesta) {
        console.log(respuesta);
        alert("¡Error en la consulta a Oracle!");
    });
}

// Esta función es llamada por cada casilla
// de la tabla, con su coordenada correspondiente
function coordenada(x, y) {
    document.getElementById("coordenada_x").value = x;
    document.getElementById("coordenada_y").value = y;

    // Reproducir audio precargado en  el index.html
    document.getElementById("audio_seleccionar").play();
}