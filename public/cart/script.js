window.addEventListener('load', function(){
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

    var url = '/cart/getdiscscart';
    fetch(url, {
        method: 'GET', // or 'PUT'
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(discitems => evaluateDiscItems(discitems));

    var totalprice = 0;

    function evaluateDiscItems(discitems){
        console.log(discitems);
        if(discitems.length != 0){
            discitems.forEach(disc => {
                createDiscCart(disc);
                totalprice += disc.price;
            });
        }else{
            createWarningMessage();            
        }
        document.querySelector('.value__desc__itemsvalue').innerHTML = '('+discitems.length+' items) <span>$'+totalprice+'</span>'
    }

    function createWarningMessage(){
        var div = document.createElement('div');
        div.setAttribute('class','warning');

        var p = document.createElement('p');
        p.setAttribute('class','warning__text');
        p.innerHTML = '<strong>UPS!</strong> you have not added any disc to your shopping cart.<br>Go to the Discography section and select the discs you want to buy.'

        div.appendChild(p);
        document.querySelector('.cartitems').appendChild(div);
    }

    function updateDiscItems(){
        var url = '/cart/getdiscscart';
        fetch(url, {
            method: 'GET', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(discitems => evaluateNewDiscItems(discitems));
    }

    function evaluateNewDiscItems(discitems){
        totalprice = 0;
        console.log(discitems);
        if(discitems.length != 0){
            discitems.forEach(disc => {
                totalprice += disc.price;
            });
        }else{
            createWarningMessage();            
        }
        document.querySelector('.value__desc__itemsvalue').innerHTML = '('+discitems.length+' items) <span>$'+totalprice+'</span>'
    }

    function createDiscCart(disc){
        var article = document.createElement('article');
        article.setAttribute('class','disc');

        var img = document.createElement('img');
        img.setAttribute('class','disc__image');
        img.setAttribute('src','../'+disc.img);

        var div = document.createElement('div');
        div.setAttribute('class','disc__desc');

        var name = document.createElement('h2');
        name.setAttribute('class','disc__desc__name');
        name.innerHTML = disc.name;

        var type = document.createElement('p');
        type.setAttribute('class','disc__desc__type');
        type.innerHTML = '<strong>'+disc.type+'</strong>';

        var year = document.createElement('p');
        year.setAttribute('class','disc__desc__year');
        year.innerHTML = 'Year published: <strong>'+disc.year+'</strong>';

        var price = document.createElement('p');
        price.setAttribute('class','disc__desc__price');
        price.innerHTML = 'Price: <span>$'+disc.price+'</span>';

        var buttondisc = document.createElement('a');
        buttondisc.setAttribute('class','disc__desc__remove');
        buttondisc.setAttribute('id','button__disc');
        buttondisc.innerHTML = 'REMOVE FROM CART';
        buttondisc.setAttribute('data-name',disc.name);

        buttondisc.addEventListener('click',function(e){
            e.preventDefault();
            fetch('/cart/removecart?', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: `disc=`+this.getAttribute('data-name'),
            })
            .then(res => res.text())
            .catch(error => console.error('Error:', error))
            .then(res => console.log(res));

            updateDiscItems();
            article.remove();
        });

        div.appendChild(name);
        div.appendChild(type);
        div.appendChild(year);
        div.appendChild(price);
        div.appendChild(buttondisc);

        article.appendChild(img);
        article.appendChild(div);

        document.querySelector('.cartitems').appendChild(article);
    }
});