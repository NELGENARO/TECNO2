let listaReparaciones = [];
let listaEmpleados = [];
let listaClientes = [];
let tablaReparaciones;
let ultimoElementoEmpleado = 0;
let ultimoElementoCliente = 0;
let ultimoElementoReparacion = 0;
$(document).ready(function () {
    validacion();

    existeReparacionesLocalStorage();
    existeEmpleadosLocalStorage();
    existeClientesLocalStorage();

    generarListaClientes();
    generarListaEmpleados();

    generarTablaReparaciones();
    $('.modal').modal();
    $('select').formSelect();

    $("#btnEliminarSesion").click(function (e) { 
        e.preventDefault();
        localStorage.removeItem('usuario');
        window.location.href = "index.html"
    });

    $("#addNuevoDetalle").click(function (e) { 
        e.preventDefault();
        let uuid = self.crypto.randomUUID();
        let detalle = 'detalle_'+uuid;
        let pago = 'pago_'+uuid;
        $("#addCampoReparacion").append(`<div class='row' id='fila_${uuid}'>
        <div class="input-field col s7">
            <input placeholder="Detalle" id="${detalle}" type="text" class="validate addDetalleClass" required>
            <label for="${detalle}">Detalle</label>
        </div>
        <div class="input-field col s3">
            <input placeholder="Precio" id="${pago}" type="number"  min='1' class="validate addPagoClass" required>
            <label for="${pago}">Precio</label>
        </div>
        <div class="input-field col s2">
            <button type="button" class="waves-effect waves-red btn-flat red lighten-1 btnDeleteRow" id="${uuid}"><i class='material-icons'>delete</i></button>
        </div></div>`);
    });

    $("#editNuevoDetalle").click(function (e) { 
        e.preventDefault();
        let uuid = self.crypto.randomUUID();
        let detalle = 'detalleEdit_'+uuid;
        let pago = 'pagoEdit_'+uuid;
        $("#editCampoReparacion").append(`<div class='row' id='filaEdit_${uuid}'>
        <div class="input-field col s7">
            <input placeholder="Detalle" id="${detalle}" type="text" class="validate editDetalleClass" required>
            <label for="${detalle}" class='active'>Detalle</label>
        </div>
        <div class="input-field col s3">
            <input placeholder="Precio" id="${pago}" type="number"  min='1' class="validate editPagoClass" required>
            <label for="${pago}" class='active'>Precio</label>
        </div>
        <div class="input-field col s2">
            <button type="button" class="waves-effect waves-red btn-flat red lighten-1 btnEditDeleteRow" id="${uuid}"><i class='material-icons'>delete</i></button>
        </div></div>`);
    });

    $('#addCampoReparacion').on('keyup','input.addPagoClass',function () { 
        let total = 0.0;
        $(".addPagoClass").each(function(){
            total += parseFloat(this.value);
        });
        $("#addTotalRepacion").html(total.toFixed(2));
    });

    $("#addCampoReparacion").on('click','button.btnDeleteRow',function () {
		$("#fila_"+this.id).remove();
        let total = 0.0;
        $(".addPagoClass").each(function(){
            total += parseFloat(this.value);
        });
        $("#addTotalRepacion").html(total.toFixed(2));
    });

    $("#editCampoReparacion").on('click','button.btnEditDeleteRow',function () {
		$("#filaEdit_"+this.id).remove();
        let total = 0.0;
        $(".editPagoClass").each(function(){
            total += parseFloat(this.value);
        });
        $("#editTotalRepacion").html(total.toFixed(2));
    });

    $('#editCampoReparacion').on('keyup','input.editPagoClass',function () { 
        let total = 0.0;
        $(".editPagoClass").each(function(){
            total += parseFloat(this.value);
        });
        $("#editTotalRepacion").html(total.toFixed(2));
    });


    $("#tablaReparaciones tbody").on('click','button.btnEliminarReparacion',function () {
		let data = tablaReparaciones.row( $(this).parents('tr') ).data();
        // console.log(data);
        $("#delIDReparacion").html(data.id_reparacion);
        $("#delFechaReparacion").html(data.fecha);
        $("#delNomCliente").html(data.cliente);
    });

    $("#delFormReparacion").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaReparaciones,$("#delIDReparacion").html());
        listaReparaciones.splice(i,1);
        generarTablaReparaciones();
        $('#modal2').modal('close');
        localStorage.setItem('Reparaciones',JSON.stringify(listaReparaciones));
        Swal.fire('Exito!!','Se ha eliminado la repracion a '+$("#delNomCliente").html(),'success');
    });

    $("#addFormReparacion").submit(function (e) { 
        e.preventDefault();
        // console.log($(".addDetalleClass").length);
        if($(".addDetalleClass").length == 0){
            Swal.fire('Problema', 'Agregue un registro para detallar pago a la reparacion','info');
            return false;
        }
        let registro = [];
        $(".addDetalleClass").each(function(){
            let tmp = this.id.split('_');
            let myDetalle = $('#detalle_'+tmp[1]).val();
            let myPago = $('#pago_'+tmp[1]).val();
            if(myDetalle.trim() != ''){
                let obj = {id_servicio: tmp[1], detalle: myDetalle , precio: myPago};
                registro.push(obj);
            }
        });
        ultimoElementoReparacion = parseInt(listaReparaciones[listaReparaciones.length -1].id_reparacion)+1;
        let myJson = {id_reparacion: ultimoElementoReparacion, fecha: $("#addFechaReparacion").val(), cliente: $("#addNomCliente").val(), 
        empleado: $("#addNomEmpleado").val(), vehiculo: $("#addIdentVehiculo").val(), total: parseFloat($("#addTotalRepacion").html()), arreglos: registro}   
        listaReparaciones.push(myJson);

        generarTablaReparaciones();
        $("#addCampoReparacion").empty();
        $('#addFormReparacion')[0].reset();
        $('#modal1').modal('close');
        localStorage.setItem('Reparaciones',JSON.stringify(listaReparaciones));
        Swal.fire('Exito!!','Se ha agregado a nueva repracion','success');
    });


    // EDITAR Empleado 
    $("#tablaReparaciones tbody").on('click','button.btnEditarReparacion',function () {
		let data = tablaReparaciones.row( $(this).parents('tr') ).data();
        console.log(data);
        $("#editCampoReparacion").empty();
        if($(`#editNomCliente option[value='${data.cliente}']`).length ==  0){
            $("#editNomCliente").append(`<option value='${data.cliente}'>${data.cliente}</option>`);
        }
        $("#editNomCliente").val(data.cliente);
        $('#editNomCliente').formSelect();

        if($(`#editNomEmpleado option[value='${data.empleado}']`).length ==  0){
            $("#editNomEmpleado").append(`<option value='${data.empleado}'>${data.empleado}</option>`);
        }
        $("#editNomEmpleado").val(data.empleado);
        $('#editNomEmpleado').formSelect();

        // $("#editNomEmpleado").val(data.empleado);
        // $('#editNomEmpleado').formSelect();

        $("#editIdentVehiculo").val(data.vehiculo);
        $("#editFechaReparacion").val(data.fecha);
		$("#editIDReparacion").html(data.id_reparacion);    
        $("#editTotalRepacion").html(data.total);   
        
        data.arreglos.forEach(element =>{
            // console.log(element);
            let uuid = element.id_servicio;
            let detalle = 'detalleEdit_'+uuid;
            let pago = 'pagoEdit_'+uuid;
            $("#editCampoReparacion").append(`<div class='row' id='filaEdit_${uuid}'>
            <div class="input-field col s7">
                <input placeholder="Detalle" id="${detalle}" type="text" class="validate editDetalleClass" required value='${element.detalle}'>
                <label for="${detalle}" class='active'>Detalle</label>
            </div>
            <div class="input-field col s3">
                <input placeholder="Precio" id="${pago}" type="number"  min='1' class="validate editPagoClass" required value='${element.precio}'>
                <label for="${pago}" class='active'>Precio</label>
            </div>
            <div class="input-field col s2">
                <button type="button" class="waves-effect waves-red btn-flat red lighten-1 btnEditDeleteRow" id="${uuid}"><i class='material-icons'>delete</i></button>
            </div></div>`);
        });
    });

    $("#editFormReparacion").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaReparaciones,$("#editIDReparacion").html());
        listaReparaciones[i].fecha = $("#editFechaReparacion").val();
        listaReparaciones[i].empleado = $("#editNomEmpleado").val();
        listaReparaciones[i].cliente = $("#editNomCliente").val();
        listaReparaciones[i].vehiculo = $("#editIdentVehiculo").val();
        listaReparaciones[i].total = $("#editTotalRepacion").html();

        listaReparaciones[i].arreglos = $("#editFoto").val();

        if($(".editDetalleClass").length == 0){
            Swal.fire('Problema', 'Agregue un registro para detallar pago a la reparacion','info');
            return false;
        }
        let registro = [];
        $(".editDetalleClass").each(function(){
            let tmp = this.id.split('_');
            let myDetalle = $('#detalleEdit_'+tmp[1]).val();
            let myPago = $('#pagoEdit_'+tmp[1]).val();
            if(myDetalle.trim() != ''){
                let obj = {id_servicio: tmp[1], detalle: myDetalle , precio: myPago};
                registro.push(obj);
            }
        });

        listaReparaciones[i].arreglos = registro;
        generarTablaReparaciones();
        $('#editFormReparacion')[0].reset();
        $('#modal3').modal('close');
        Swal.fire('Exito!!','Se ha actualizado a Empleado','success');
        localStorage.setItem('Reparaciones',JSON.stringify(listaReparaciones));
    });
});



function generarTablaReparaciones(){
    $('#tablaReparaciones').dataTable().fnDestroy();
	tablaReparaciones = $('#tablaReparaciones').DataTable({
        "data" : listaReparaciones,
        "order": [[ 0, "desc" ]],
        "columns" : [
            { "data" : "id_reparacion" },
            { "data" : "fecha" },
            { "data" : "cliente" },
            { "data" : "empleado" },
            { "data" : "vehiculo" },
            { "data" : "total" },
            { data: null,
				defaultContent:
				"<button type='button' data-target='modal3' class='btn waves-effect yellow accent-4 modal-trigger btnEditarReparacion' ><i class='material-icons'>edit</i></button> "+
				"<button type='button' data-target='modal2' class='btn waves-effect red  modal-trigger btnEliminarReparacion'><i class='material-icons'>delete</i></button>",
				width: "10%"
			}
        ]
    });
}

function buscarElemento(lista, id){
    for (let i = 0; i < lista.length; i++) {
        let element = lista[i];
        if(element.id_reparacion == id){
            return i;
        }
    }
    return -1;
}

function existeReparacionesLocalStorage(){
    if(localStorage.hasOwnProperty("Reparaciones")){
        listaReparaciones = JSON.parse(localStorage.getItem('Reparaciones'));
        ultimoElementoReparacion = listaReparaciones.length -1;
    }else{
        listaReparaciones = [{id_reparacion:1 ,fecha:'2022-10-30',cliente:'Susana Mendoza Perez',empleado:'juan Jose Torre', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5761c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5714c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:2 ,fecha:'2022-10-30',cliente:'Reynaldo Peña Torrejon',empleado:'Miguel Perez Mamani', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5762c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5724c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:3 ,fecha:'2022-10-30',cliente:'Isabel Mamani Cortez',empleado:'Daniel Quispe Acha', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5763c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5734c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:4 ,fecha:'2022-10-30',cliente:'Juan Luis Guevara',empleado:'Daniel Quispe Acha', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5764c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5744c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:5 ,fecha:'2022-10-30',cliente:'Sandro Flores Merida',empleado:'Daniel Quispe Acha', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5765c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5754c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:6 ,fecha:'2022-10-30',cliente:'Dante Lozada Bench',empleado:'Daniel Quispe Acha', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5766c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5764c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:7 ,fecha:'2022-10-30',cliente:'Humberto Higinio',empleado:'Mateo Andrade Merida', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5767c', detalle: 'Luis Antonio Sejas', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5774c', detalle:'Cambio de aceite', precio: 100}]},
        {id_reparacion:8 ,fecha:'2022-10-30',cliente:'Ruben Copa Villca',empleado:'Mateo Andrade Merida', vehiculo: 'Toyota corrola Placr 12365',total: 250, arreglos:
        [{id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5768c', detalle: 'cambio de neumatico', precio: 150}, {id_servicio: 'bf9e0a5a-03b5-4af4-afcd-ada067c5784c', detalle:'Cambio de aceite', precio: 100}]}
        ];
        ultimoElementoReparacion = parseInt(listaReparaciones[listaReparaciones.length -1].id_reparacion)+1;
        localStorage.setItem('Reparaciones',JSON.stringify(listaReparaciones));
    }
}

function existeEmpleadosLocalStorage(){
    if(localStorage.hasOwnProperty("Empleados")){
        listaEmpleados = JSON.parse(localStorage.getItem('Empleados'));
        ultimoElementoEmpleado = listaEmpleados.length -1;
    }else{
        listaEmpleados = [{id_empleado:1 ,nombre:'juan Jose Torrez',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:2 ,nombre:'Miguel Perez Mamani',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:3 ,nombre:'Daniel Quispe Acha',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:4 ,nombre:'Ana Rodiguez Vejaz',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:5 ,nombre:'Oscar Varga Teran',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:6 ,nombre:'Rosimar Panozo Toledo',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:7 ,nombre:'Juan Villca Rios',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:8 ,nombre:'Mateo Andrade Merida',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'}
        ];
        ultimoElementoEmpleado = parseInt(listaEmpleados[listaEmpleados.length -1].id_empleado)+1;
        localStorage.setItem('Empleados',JSON.stringify(listaEmpleados));
    }
}

function existeClientesLocalStorage(){
    if(localStorage.hasOwnProperty("clientes")){
        listaClientes = JSON.parse(localStorage.getItem('clientes'));
        ultimoElementoCliente = listaClientes.length -1;
    }else{
        listaClientes = [{id_cliente:1 ,nombre:'juan Jose Torrez', carnet:'185215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:2 ,nombre:'Miguel Perez Mamani', carnet:'285215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:3 ,nombre:'Daniel Quispe Acha', carnet:'15215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:4 ,nombre:'Ana Rodiguez Vejaz', carnet:'585215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:5 ,nombre:'Oscar Varga Teran', carnet:'785215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:5 ,nombre:'Rosimar Panozo Toledo', carnet:'475215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:7 ,nombre:'Juan Villca Rios', carnet:'655215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:8 ,nombre:'Mateo Andrade Merida', carnet:'628215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'}
        ];
        ultimoElementoCliente = parseInt(listaClientes[listaClientes.length -1].id_cliente)+1;
        localStorage.setItem('clientes',JSON.stringify(listaClientes));
    }
}

function generarListaClientes(){
    listaClientes.forEach(element => {
        $("#addNomCliente").append(`<option value='${element.nombre}'>${element.nombre}</option>`);
        $("#editNomCliente").append(`<option value='${element.nombre}'>${element.nombre}</option>`);
    });
}

function generarListaEmpleados(){
    // console.log(listaEmpleados);
    listaEmpleados.forEach(element => {
        $("#addNomEmpleado").append(`<option value='${element.nombre}'>${element.nombre}</option>`);
        $("#editNomEmpleado").append(`<option value='${element.nombre}'>${element.nombre}</option>`);
    });
}

function validacion(){
    if(!localStorage.hasOwnProperty("usuario")){
        window.location.href = "index.html?error=acceso"
    }
}