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

var buttons = document.getElementsByClassName("discs__item__content__button");
for (let index = 0; index < buttons.length; index++) {
  const button = buttons[index];
  button.addEventListener('click', function(e){
    e.preventDefault();
    var data = button.getAttribute('data-name');
    var url = '/discography/song?disc='+data;
    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  });
}



