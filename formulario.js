// limpiar los datos de la pagina
window.addEventListener('beforeunload', function() {
  localStorage.removeItem('datos');
});

// obtener los valores del formulario 
function validarFormulario() {
  var nombreEmpresa = document.getElementById("Empresa").value;
  var nombre = document.getElementById("nombre").value;
  var apellido = document.getElementById("apellido").value;
  var sueldo = document.getElementById("sueldo").value;
  var moneda = document.getElementById("moneda").value;

  // calcula las equivalencia de las moneda en forma manual 
  var equivalenciaARS;
  if (moneda === "ARS") {
    equivalenciaARS = sueldo;
  } else if (moneda === "USD") {
    equivalenciaARS = sueldo * 449.05;
  } else if (moneda === "EUR") {
    equivalenciaARS = sueldo * 455.1;
  }

  // se verifica y establece un limite a las monedas
  if ((moneda === "ARS" || moneda === "USD") && sueldo < 100000) {
    alert("El sueldo debe ser igual o mayor a 100,000 ARS. Ingresa el monto sin puntos.");
    return false;
  }

  if ((moneda === "USD" || moneda === "EUR") && sueldo < 223) {
    alert("El sueldo debe ser igual o mayor a 223 USD. Ingresa el monto sin puntos.");
    return false;
  }

  if ((moneda === "EUR" || moneda === "EUR") && sueldo < 26000) {
    alert("El sueldo debe ser igual o mayor a 25.855 EUR. Ingresa el monto sin puntos.");
    return false;
  }

  // se crear los datos
  var datos = {
    nombreEmpresa: nombreEmpresa,
    nombre: nombre,
    apellido: apellido,
    sueldo: sueldo,
    moneda: moneda,
    equivalenciaARS: equivalenciaARS
  };

  // se guardan datos momentáneamente de forma local
  var datosGuardados = localStorage.getItem("datos");
  if (datosGuardados) {
    var datosParseados = JSON.parse(datosGuardados);
    datosParseados.push(datos);
    localStorage.setItem("datos", JSON.stringify(datosParseados));
  } else {
    localStorage.setItem("datos", JSON.stringify([datos]));
  }

  // se limpia formulario 
  document.getElementById("Empresa").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("sueldo").value = "";
  document.getElementById("moneda").value = "ARS";

  return false;
}


// se ordena los datos guardados 

function ordenarDatosGuardados(campo) {
  var tabla = document.getElementById("tablaDatos");
  var tbody = tabla.getElementsByTagName("tbody")[0];
  var filas = tbody.getElementsByTagName("tr");
  var datos = [];

  for (var i = 0; i < filas.length; i++) {
    var fila = filas[i];
    var datosFila = {
      nombreEmpresa: fila.cells[0].textContent,
      apellido: fila.cells[1].textContent,
      nombre: fila.cells[2].textContent,
      sueldo: fila.cells[3].textContent
    };

    datos.push(datosFila);
  }

  datos.sort(function(a, b) {
    var valorA = a[campo];
    var valorB = b[campo];

    if (valorA < valorB) return -1;
    if (valorA > valorB) return 1;
    return 0;
  });

  mostrarDatosOrdenados(datos);

  // se actualiza el contenido de la pag.
  var tablaPrincipal = document.getElementById("tablaPrincipal");
  var tbodyPrincipal = tablaPrincipal.getElementsByTagName("tbody")[0];
  tbodyPrincipal.innerHTML = "";
  mostrarDatosOrdenados(datos);
}
// funcion para mostrar los datos ordenados 
function mostrarDatosOrdenados(datos) {
  var tabla = document.getElementById("tablaDatos");
  var tbody = tabla.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  for (var i = 0; i < datos.length; i++) {
    var fila = document.createElement("tr");
    var datosFila = datos[i];

    var celdaEmpresa = document.createElement("td");
    celdaEmpresa.textContent = datosFila.nombreEmpresa;
    fila.appendChild(celdaEmpresa);

    var celdaApellido = document.createElement("td");
    celdaApellido.textContent = datosFila.apellido;
    fila.appendChild(celdaApellido);

    var celdaNombre = document.createElement("td");
    celdaNombre.textContent = datosFila.nombre;
    fila.appendChild(celdaNombre);

    var celdaSueldo = document.createElement("td");
    celdaSueldo.textContent = datosFila.sueldo;
    fila.appendChild(celdaSueldo);

    tbody.appendChild(fila);
  }
}

//funcion para abrir una nueva pestaña con los datos guardados 
function abrirNuevaPestana() {
  var nuevaPestana = window.open("", "_blank");
  nuevaPestana.document.open();
  nuevaPestana.document.write("<!DOCTYPE html><head><title>Datos Guardados</title><style>#tablaDatos th { cursor: pointer; }</style></head><body></body></html>");
  nuevaPestana.document.close();

  var datosGuardados = localStorage.getItem("datos");

  if (datosGuardados) {
    var datosParseados = JSON.parse(datosGuardados);
    var contenidoHTML = "";

    contenidoHTML += "<table id='tablaDatos'>";
    contenidoHTML += "<thead>";
    contenidoHTML += "<tr>";
    contenidoHTML += "<th data-campo='nombreEmpresa'>Empresa</th>";
    contenidoHTML += "<th data-campo='apellido'>Apellido</th>";
    contenidoHTML += "<th data-campo='nombre'>Nombre</th>";
    contenidoHTML += "<th data-campo='sueldo'>Sueldo</th>";
    contenidoHTML += "</tr>";
    contenidoHTML += "</thead>";
    contenidoHTML += "<tbody>";

    datosParseados.forEach(function(datos) {
      contenidoHTML += "<tr>" +
                       "<td>" + datos.nombreEmpresa + "</td>" +
                       "<td>" + datos.apellido + "</td>" +
                       "<td>" + datos.nombre + "</td>" +
                       "<td>" + datos.sueldo + " " + datos.moneda + "</td>" +
                       "</tr>";
    });

    contenidoHTML += "</tbody>";
    contenidoHTML += "</table>";

    // se agrega evento para los click en los encabezados 
    contenidoHTML += "<script>";
    contenidoHTML += "document.getElementById('tablaDatos').addEventListener('click', function(event) {";
    contenidoHTML += "  if (event.target.tagName === 'TH') {";
    contenidoHTML += "    var campo = event.target.dataset.campo;";
    contenidoHTML += "    if (campo) {";
    contenidoHTML += "      ordenarDatosGuardados(campo);";
    contenidoHTML += "    }";
    contenidoHTML += "  }";
    contenidoHTML += "});";
    contenidoHTML += "</script>";


    nuevaPestana.document.body.innerHTML += contenidoHTML;
  } else {
    alert("No se han guardado datos aún.");
  }
}
