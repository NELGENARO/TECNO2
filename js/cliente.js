let listaClientes = [];
let tablaClientes;
let ultimoElemento = 0;
$(document).ready(function () {
    validacion();
    // localStorage.setItem("lastname", "Smith");
    existeClientesLocalStorage();
    generarTablaClientes();
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

    $("#tablaClientes tbody").on('click','button.btnEliminarCliente',function () {
		let data = tablaClientes.row( $(this).parents('tr') ).data();
        $("#delIDcliente").html(data.id_cliente);
        $("#delNomCliente").html(data.nombre);
    });

    $("#delFormCliente").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaClientes,$("#delIDcliente").html());
        listaClientes.splice(i,1)
        generarTablaClientes();
        $('#modal2').modal('close');
        localStorage.setItem('clientes',JSON.stringify(listaClientes));
        Swal.fire('Exito!!','Se ha eliminado a cliente','success');
    });

    $("#addFormCliente").submit(function (e) { 
        e.preventDefault();
        ultimoElemento =parseInt(listaClientes[listaClientes.length -1].id_cliente)+1;
        let myJson = {id_cliente: ultimoElemento, nombre: $("#addNombreCliente").val(), carnet: $("#addCarnetCliente").val(),
                      direccion: $("#addDireccionCliente").val(), celular: $("#addCelCliente").val(), foto: $("#foto").val()}   
        listaClientes.push(myJson);

        generarTablaClientes();
        $('#addFormCliente')[0].reset();
        $('#modal1').modal('close');
        localStorage.setItem('clientes',JSON.stringify(listaClientes));
        Swal.fire('Exito!!','Se ha agregado a cliente','success');
    });


    // EDITAR CLIENTE 
    $("#tablaClientes tbody").on('click','button.btnEditarCliente',function () {
		let data = tablaClientes.row( $(this).parents('tr') ).data();
        $("#editNombreCliente").val(data.nombre);
        $("#editCarnetCliente").val(data.carnet);
        $("#editDireccionCliente").val(data.direccion);
        $("#editCelCliente").val(data.celular);
		$("#editIDCliente").html(data.id_cliente);
        $("#editFoto").val(data.foto);
        let ruta = $("#editFoto").val();
        // $('#editFoto').material_select()
        $('#editFoto').formSelect();
        let preview = document.getElementById("editImagenUsuario");
        preview.src = ruta;
        preview.style.display = "block";
    });

    $("#editFormCliente").submit(function (e) { 
        e.preventDefault();
        let  i = buscarElemento(listaClientes,$("#editIDCliente").html());
        listaClientes[i].nombre = $("#editNombreCliente").val();
        listaClientes[i].carnet = $("#editCarnetCliente").val();
        listaClientes[i].direccion = $("#editDireccionCliente").val();
        listaClientes[i].celular = $("#editCelCliente").val();
        listaClientes[i].foto = $("#editFoto").val();
        generarTablaClientes();
        $('#editFormCliente')[0].reset();
        $('#modal3').modal('close');
        Swal.fire('Exito!!','Se ha actualizado a cliente','success');
        localStorage.setItem('clientes',JSON.stringify(listaClientes));
    });
});



function generarTablaClientes(){
    $('#tablaClientes').dataTable().fnDestroy();
	tablaClientes = $('#tablaClientes').DataTable({
        "data" : listaClientes,
        "order": [[ 0, "desc" ]],
        "columns" : [
            { "data" : "id_cliente" },
            { "data" : "nombre" },
            { "data" : "carnet" },
            { "data" : "direccion" },
            { "data" : "celular" },
            { "data": null ,
              "render": function ( data) {
                return `<img src=${data.foto} width="40px">`;}
            },
            { data: null,
				defaultContent:
				"<button type='button' data-target='modal3' class='btn waves-effect yellow accent-4 modal-trigger btnEditarCliente' ><i class='material-icons'>edit</i></button> "+
				"<button type='button' data-target='modal2' class='btn waves-effect red  modal-trigger btnEliminarCliente'><i class='material-icons'>delete</i></button>",
				width: "10%"
			}
        ]
    });
}

function buscarElemento(lista, id){
    for (let i = 0; i < lista.length; i++) {
        let element = lista[i];
        if(element.id_cliente == id){
            return i;
        }
    }
    return -1;
}

function existeClientesLocalStorage(){
    if(localStorage.hasOwnProperty("clientes")){
        listaClientes = JSON.parse(localStorage.getItem('clientes'));
        // ultimoElemento = listaClientes.length -1;
        ultimoElemento = parseInt(listaClientes[listaClientes.length -1].id_cliente)+1;
    }else{
        listaClientes = [{id_cliente:1 ,nombre:'juan Jose Torrez', carnet:'185215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:2 ,nombre:'Miguel Perez Mamani', carnet:'285215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:3 ,nombre:'Daniel Quispe Acha', carnet:'15215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:4 ,nombre:'Ana Rodiguez Vejaz', carnet:'585215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:5 ,nombre:'Oscar Varga Teran', carnet:'785215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:6 ,nombre:'Rosimar Panozo Toledo', carnet:'475215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:7 ,nombre:'Juan Villca Rios', carnet:'655215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'},
        {id_cliente:8 ,nombre:'Mateo Andrade Merida', carnet:'628215555',direccion :'Calle Bolivar y Mira flores #1482',celular:'77822445', foto: 'img/perfil/3530467234.jpg'}
        ];
        ultimoElemento = parseInt(listaClientes[listaClientes.length -1].id_cliente)+1;
        localStorage.setItem('clientes',JSON.stringify(listaClientes));
    }
}

function validacion(){
    if(!localStorage.hasOwnProperty("usuario")){
        window.location.href = "index.html?error=acceso"
    }
}