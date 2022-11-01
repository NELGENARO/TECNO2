// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = function() {
    let nombre = document.getElementById("nombre").value;
    let pass = document.getElementById("pass").value;
    if(nombre == 'admin' && pass =='123456'){
        document.getElementById("msjlogin").innerHTML = 'Exito, se ha registado al usuario correctamente!!!';
    }else{
        document.getElementById("msjlogin").innerHTML = 'Problema, el usuario no existe en la base de datos!!!';
    }
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var btnCalcular = document.getElementById("btnCalcular");
btnCalcular.onclick = function() {
    let dolar = parseFloat(document.getElementById("inputDolar").value);
    let boliviano = parseFloat(document.getElementById("inputBs").value);
    let cambio = 0;
    if(dolar == '' || dolar == '0' || isNaN(dolar)){
        console.log(boliviano);
        cambio = 0.1453 * boliviano;
        // cons
        document.getElementById("inputDolar").value = cambio;
    }else{
        cambio = 6.88 * dolar;
        document.getElementById("inputBs").value = cambio;
    }
}