console.log("entro a discografía wiii");

//Toma el valor del desplazamiento vertical en la página
var prevScrollpos = window.pageYOffset;

//Se encarga de desplazar verticalmente el menú de navegación (lo esconde y lo revela dependiendo del desplazamiento vertical)
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector(".globalnav").style.top = "0";
  } else {
    document.querySelector(".globalnav").style.top = "-230px";
  }
  prevScrollpos = currentScrollPos;
};


var data = 'CASTLE OF GLASS';
var url = '/discography/song?disc='+data;

fetch(url, {
  method: 'GET', // or 'PUT'
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
