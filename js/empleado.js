let listaEmpleados = [];
let tablaEmpleados;
let ultimoElemento = 0;
$(document).ready(function () {
    validacion();

    existeEmpleadosLocalStorage();
    generarTablaEmpleados();
    $('.modal').modal();
    $('select').formSelect();

    $("#btnEliminarSesion").click(function (e) { 
        e.preventDefault();
        localStorage.removeItem('usuario');
        window.location.href = "index.html"
    });

    $("#foto").change(function (e) { 
        e.preventDefault();
        let ruta = $("#foto").val();
        let preview = document.getElementById("addImagenUsuario");
        preview.src = ruta;
        preview.style.display = "block";
    });

    $("#editFoto").change(function (e) { 
        e.preventDefault();
        let ruta = $("#editFoto").val();
        let preview = document.getElementById("editImagenUsuario");
        preview.src = ruta;
        preview.style.display = "block";
    });

    $("#tablaEmpleados tbody").on('click','button.btnEliminarEmpleado',function () {
		let data = tablaEmpleados.row( $(this).parents('tr') ).data();
        $("#delIDEmpleado").html(data.id_empleado);
        $("#delNomEmpleado").html(data.nombre);
    });

    $("#delFormEmpleado").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaEmpleados,$("#delIDEmpleado").html());
        listaEmpleados.splice(i,1)
        generarTablaEmpleados();
        $('#modal2').modal('close');
        localStorage.setItem('Empleados',JSON.stringify(listaEmpleados));
        Swal.fire('Exito!!','Se ha eliminado a Empleado','success');
    });

    $("#addFormEmpleado").submit(function (e) { 
        e.preventDefault();
        ultimoElemento = parseInt(listaEmpleados[listaEmpleados.length -1].id_empleado)+1;
        let myJson = {id_empleado: ultimoElemento, nombre: $("#addNombreEmpleado").val(), pass: $("#addPasswordEmpleado").val(),
                      usuario: $("#addUsuarioEmpleado").val(), celular: $("#addCelEmpleado").val(), foto: $("#foto").val()}   
        listaEmpleados.push(myJson);

        generarTablaEmpleados();
        $('#addFormEmpleado')[0].reset();
        $('#modal1').modal('close');
        localStorage.setItem('Empleados',JSON.stringify(listaEmpleados));
        Swal.fire('Exito!!','Se ha agregado a Empleado','success');
    });


    // EDITAR Empleado 
    $("#tablaEmpleados tbody").on('click','button.btnEditarEmpleado',function () {
		let data = tablaEmpleados.row( $(this).parents('tr') ).data();
        $("#editNombreEmpleado").val(data.nombre);
        $("#editPasswordEmpleado").val(data.pass);
        $("#editUsuarioEmpleado").val(data.usuario);
        $("#editCelEmpleado").val(data.celular);
		$("#editIDEmpleado").html(data.id_empleado);
        $("#editFoto").val(data.foto);
        let ruta = $("#editFoto").val();
        // $('#editFoto').material_select()
        $('#editFoto').formSelect() ;
        let preview = document.getElementById("editImagenUsuario");
        preview.src = ruta;
        preview.style.display = "block";
    });

    $("#editFormEmpleado").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaEmpleados,$("#editIDEmpleado").html());
        listaEmpleados[i].nombre = $("#editNombreEmpleado").val();
        listaEmpleados[i].pass = $("#editPasswordEmpleado").val();
        listaEmpleados[i].usuario = $("#editUsuarioEmpleado").val();
        listaEmpleados[i].celular = $("#editCelEmpleado").val();
        listaEmpleados[i].foto = $("#editFoto").val();
        generarTablaEmpleados();
        // $('#editFormEmpleado')[0].reset();
        $('#modal3').modal('close');
        Swal.fire('Exito!!','Se ha actualizado a Empleado','success');
        localStorage.setItem('Empleados',JSON.stringify(listaEmpleados));
    });
});



function generarTablaEmpleados(){
    $('#tablaEmpleados').dataTable().fnDestroy();
	tablaEmpleados = $('#tablaEmpleados').DataTable({
        "data" : listaEmpleados,
        "order": [[ 0, "desc" ]],
        "columns" : [
            { "data" : "id_empleado" },
            { "data" : "nombre" },
            { "data" : "celular" },
            { "data" : "usuario" },
            { "data": null ,
              "render": function ( data) {
                return `<img src=${data.foto} width="40px">`;}
            },
            { data: null,
				defaultContent:
				"<button type='button' data-target='modal3' class='btn waves-effect yellow accent-4 modal-trigger btnEditarEmpleado' ><i class='material-icons'>edit</i></button> "+
				"<button type='button' data-target='modal2' class='btn waves-effect red  modal-trigger btnEliminarEmpleado'><i class='material-icons'>delete</i></button>",
				width: "10%"
			}
        ]
    });
}

function buscarElemento(lista, id){
    for (let i = 0; i < lista.length; i++) {
        let element = lista[i];
        if(element.id_empleado == id){
            return i;
        }
    }
    return -1;
}

function existeEmpleadosLocalStorage(){
    if(localStorage.hasOwnProperty("Empleados")){
        listaEmpleados = JSON.parse(localStorage.getItem('Empleados'));
        // ultimoElemento = listaEmpleados.length -1;
        ultimoElemento = parseInt(listaEmpleados[listaEmpleados.length -1].id_empleado)+1;
    }else{
        listaEmpleados = [{id_empleado:1 ,nombre:'juan Jose Torrez',celular:'77822445',usuario:'admin@gmail.com',pass: 'qwerty', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:2 ,nombre:'Miguel Perez Mamani',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:3 ,nombre:'Daniel Quispe Acha',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:4 ,nombre:'Ana Rodiguez Vejaz',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:5 ,nombre:'Oscar Varga Teran',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:6 ,nombre:'Rosimar Panozo Toledo',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:7 ,nombre:'Juan Villca Rios',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'},
        {id_empleado:8 ,nombre:'Mateo Andrade Merida',celular:'77822445',usuario:'ejemploEmpleado@gmail.com',pass: '123456', foto: 'img/perfil/3530467234.jpg'}
        ];
        ultimoElemento = parseInt(listaEmpleados[listaEmpleados.length -1].id_empleado)+1;
        localStorage.setItem('Empleados',JSON.stringify(listaEmpleados));
    }
}

function validacion(){
    if(!localStorage.hasOwnProperty("usuario")){
        window.location.href = "index.html?error=acceso"
    }
}