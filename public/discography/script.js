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
    p.innerHTML = disc.type+' published in '+disc.year+' - Available for <span>$'+disc.price+'</span>';

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

  document.querySelector('.searchfilter').addEventListener('click',function(e){
    e.preventDefault();
    updateDiscs();
  });

  function updateDiscs(){
    var url = '/discography/updatedisc?';

    var type = document.querySelector('.type-select');
    console.log('type  ////////////////////');
    var selectedOption = type.options[type.selectedIndex];
    console.log(selectedOption.value+" : "+selectedOption.text);
    if(selectedOption.value != 0){
      url+= ('type='+selectedOption.text);
    }else{
      url+= ('type=none');
    }

    var year = document.querySelector('.year-select');
    console.log('year  ////////////////////');
    var selectedOption = year.options[year.selectedIndex];
    console.log(selectedOption.value+" : "+selectedOption.text);
    if(selectedOption.value != 0){
      url+= ('&year='+selectedOption.text);
    }else{
      url+= ('&year=-1');
    }

    var price = document.querySelector('.price-input');
    console.log('price  ////////////////////');
    console.log(price.value+' : '+price.text);
    if(price.value != ""){
      url+= ('&price='+price.value);
    }else{
      url+= ('&price=-1');
    }

    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(newdiscs => {
      document.getElementsByClassName('discs')[0].innerHTML = "";
      console.log(newdiscs);
      newdiscs.forEach(disc => {
        createDisc(disc);
      });
    });
  }

  function createDisc(disc){
    var article = document.createElement('article');
    article.setAttribute('class','discs__item');
    article.setAttribute('data-name',disc.name);

    var img = document.createElement('img');
    img.setAttribute('class','discs__item__img');
    img.setAttribute('src','../'+disc.img);

    var div = document.createElement('div');
    div.setAttribute('class','discs__item__content');

    var h3 = document.createElement('h3');
    h3.innerHTML = disc.name;

    var p = document.createElement('p');
    p.innerHTML = disc.type+': '+disc.price;

    var a =document.createElement('a');
    a.setAttribute('class','discs__item__content__button');
    a.setAttribute('id','button');
    a.setAttribute('data-name',disc.name);
    a.innerHTML = 'STREAM / PURCHEASE';
    a.addEventListener('click',function(e){
      e.preventDefault();
      getSelectedDisc(this.getAttribute('data-name'));
    });

    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(a);

    article.appendChild(img);
    article.appendChild(div);

    document.querySelector('.discs').appendChild(article);
  }
  // funciones de los custom-selec // ********************************

    var x, i, j, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  x = document.getElementsByClassName("custom-select");
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          var y, i, k, s, h;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          h = this.parentNode.previousSibling;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
  
});

