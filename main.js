// Objeto Tarea
function Tarea(nombreTarea, descripcionTarea, fechaInicioTarea, estadoTarea) {
    this.nombreTarea = nombreTarea;
    this.descripcionTarea = descripcionTarea;
    this.fechaInicioTarea = fechaInicioTarea;
    this.estadoTarea = estadoTarea;
}


//Llenado de los Estados en elemento HTML <select> desde JSON
let estadoTareaJSON = document.getElementById("estado");
const listaEstadosJSON = "estadosTarea.json";

fetch(listaEstadosJSON)
    .then(respuesta => respuesta.json())
    .then(datos => {
        datos.forEach(estado => {
            let option = document.createElement("option");
            option.value = estado.nombreEstado;
            option.textContent = estado.nombreEstado;
            estadoTareaJSON.options.add(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar los estados de tarea:", error);
    });


// Obtener lista de tareas almacenadas en el Local Storage
function obtenerListaTareas() {
    let storedData = localStorage.getItem('listaTareas');
    return storedData ? JSON.parse(storedData) : [];
}

// Guardar lista de tareas en el Local Storage
function guardarListaTareas(listaTareas) {
    localStorage.setItem('listaTareas', JSON.stringify(listaTareas));
}

// Método para agregar una tarea
function agregarTarea() {
    let nombreTarea = document.getElementById("nombre").value.trim();
    let descripcionTarea = document.getElementById("descripcion").value;
    let fechaInicioTarea = document.getElementById("fechaInicio").value;
    let estadoTarea = document.getElementById("estado").value;

    if (nombreTarea === "" || descripcionTarea === "" || fechaInicioTarea === "" || estadoTarea === "") {
        Swal.fire(
            'Campos Vacios.',
            'No deben haber campos vacios para agregar una Tarea.',
            'error'
        );
        return;
    }

    let listaTareas = obtenerListaTareas();

    if (listaTareas.some(tarea => tarea.nombreTarea.toUpperCase() === nombreTarea.toUpperCase())) {
        Swal.fire(
            'Tarea Existente',
            'Ya existe una tarea con el nombre "' + nombreTarea + '" .Ingrese un nombre de tarea distinto.',
            'warning'
        );
        return;
    }

    let nuevaTarea = new Tarea(nombreTarea, descripcionTarea, fechaInicioTarea, estadoTarea);

    Swal.fire({
        title: 'Agregar Tarea',
        text: "¿Está seguro que desea agregar la tarea " + nombreTarea + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar'
    }).then((result) => {
        if (result.isConfirmed) {
            listaTareas.push(nuevaTarea);
            guardarListaTareas(listaTareas);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'La tarea "' + nombreTarea + '" fue agregada correctamente.',
                showConfirmButton: false,
                timer: 3000
              })
            mostrarTareas(listaTareas);
            limpiarCampos();
        }
    })
}

// Método para eliminar una tarea
function eliminarTarea() {
    let nombreTarea = document.getElementById("nombre").value.trim();

    if (nombreTarea === "") {
        Swal.fire(
            'Eliminar Tarea',
            'Debe ingresar un nombre de tarea válido.',
            'warning'
        );
        return;
    }

    let listaTareas = obtenerListaTareas();
    let tareaExistente = listaTareas.findIndex(tarea => tarea.nombreTarea.toUpperCase() === nombreTarea.toUpperCase());

    if (tareaExistente !== -1) {
        Swal.fire({
            title: 'Eliminar Tarea',
            text: "¿Está seguro que desea eliminar la tarea " + nombreTarea + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                listaTareas.splice(tareaExistente, 1);
                guardarListaTareas(listaTareas);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'La tarea "' + nombreTarea + '" fue eliminada correctamente.',
                    showConfirmButton: false,
                    timer: 3000
                  })
                mostrarTareas(listaTareas);
                limpiarCampos();
            }
        });
    } else {
        Swal.fire(
            'Eliminar Tarea',
            'No existe la tarea llamada "' + nombreTarea + '".',
            'error'
        );
    }
}

// Método para mostrar las tareas en una tabla HTML
function mostrarTareas(tareas) {
    let tabla = document.getElementById("tablaTareas");
    let tbody = tabla.querySelector("tbody");
    tbody.innerHTML = "";

    tareas.forEach((tarea) => {
        let fila = tbody.insertRow();
        let nombreCelda = fila.insertCell();
        let descripcionCelda = fila.insertCell();
        let fechaInicioCelda = fila.insertCell();
        let estadoCelda = fila.insertCell();

        nombreCelda.innerText = tarea.nombreTarea;
        nombreCelda.classList.add("listaTarea");
        descripcionCelda.innerText = tarea.descripcionTarea;
        descripcionCelda.classList.add("listaTarea");
        fechaInicioCelda.innerText = tarea.fechaInicioTarea;
        fechaInicioCelda.classList.add("listaTarea");
        estadoCelda.innerText = tarea.estadoTarea;
        estadoCelda.classList.add("listaTarea");
    });
}

// Método para limpiar los campos del formulario
function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("fechaInicio").value = "";
    document.getElementById("estado").value = "";
}

// Cargar las tareas al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    let listaTareas = obtenerListaTareas();
    mostrarTareas(listaTareas);
});

function limpiarLocalStorage() {
    Swal.fire({
        title: 'Limpiar Storage',
        text: "¿Está seguro que desea borrar todo?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Local Storage limpiado correctamente.',
                showConfirmButton: false,
                timer: 3000
              })
            mostrarTareas([]);
        }
    })
}