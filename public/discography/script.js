
window.addEventListener('load', function(){
  console.log("ingresó a discografía");

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
      getSelectedDisc(this.getAttribute('data-name'));
    });
  }

  function getSelectedDisc(name){
    var url = '/discography/song?disc='+name;
    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(disc => createDiscPresentation(disc));
  }

  function createDiscPresentation(disc){
    var section = document.createElement('section');
    section.setAttribute('class', 'discpresentation');
    
    var btnClose = document.createElement('a');
    btnClose.setAttribute('class', 'discpresentation__close');
    btnClose.setAttribute('id', 'close');
    btnClose.innerHTML = "X";
    btnClose.addEventListener('click',function(e){
      e.preventDefault();
      section.remove();
    });

    var div = document.createElement('div');
    div.setAttribute('class', 'discpresentation__reproductor');

    var img =document.createElement('img');
    img.setAttribute('class', 'discpresentation__reproductor__image');
    img.setAttribute('src', '../'+disc.img);

    var frame = document.createElement('iframe');
    frame.setAttribute('class', 'discpresentation__reproductor__song');
    frame.setAttribute('src',disc.url);
    frame.setAttribute('frameborder','0');
    frame.setAttribute('allowtransparency','true');
    frame.setAttribute('allow','encrypted-media');

    var p = document.createElement('p');
    p.setAttribute('class','discpresentation__reproductor__desc');
    p.innerHTML = disc.type+' - Available for <span>'+disc.price+'$</span>';

    var btnCart =document.createElement('a');
    btnCart.setAttribute('class', 'discpresentation__btncart');
    btnCart.setAttribute('id', 'button');
    btnCart.setAttribute('href','');
    btnCart.setAttribute('data-name',disc.name);

    var url = '/discography/songstatus?disc='+disc.name;
    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.text())
    .catch(error => console.error('Error:', error))
    .then(content => btnCart.innerHTML = content);

    btnCart.addEventListener('click',function(e){
      e.preventDefault();
      var url;
      if(this.innerHTML == 'ADD TO CART'){
        url = '/discography/addcart?';
      }
      if(this.innerHTML == 'REMOVE FROM CART'){
        url = '/discography/removecart?';
      }
      fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `disc=`+this.getAttribute('data-name'),
      })
      .then(res => res.text())
      .catch(error => console.error('Error:', error))
      .then(newcontent => this.innerHTML = newcontent);
    });

    div.appendChild(img);
    div.appendChild(frame);
    div.appendChild(p);

    section.appendChild(btnClose);
    section.appendChild(div);

    section.appendChild(btnCart);

    document.getElementsByTagName('body')[0].appendChild(section);
  }

});

