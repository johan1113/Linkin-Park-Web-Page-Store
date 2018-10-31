const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//para definir la carpeta publica
app.use(express.static('public'));
//para registrar el motor de render handlebars
app.engine('handlebars', hbs());
//para setear el motor de render a utilizar
app.set('view engine', 'handlebars');

// importar módulo body-parser
var bodyParser = require('body-parser');
// configurar módulo body-parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// usar body-parser
app.use(express.json());


// Conexion a la URL
const url = 'mongodb://localhost:27017';
//nombre de la base de datos
const dbName = 'linkinpark';
// Crea un nuevo MongoClient
const client = new MongoClient(url);

var db = null;
// metodo encargado de conectar con el servidor
client.connect(function(err) {
    if(err){
        console.err("ha fallado la conexion con el servidor");
        return;
    }
    db = client.db(dbName);
});

//defninir ruta root o principal
app.get('/', function(request, response){
    response.render('home');
});

app.get('/discography', function(request, response){
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var discs_items = {
            filter: "ALL",
            discs: docs,
        }
        response.render('discography', discs_items);
    });
});

app.get('/discography/song', function(request, response){
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var name = request.query.disc;
        console.log('identifica a: '+name);
        var disc = docs.find(function(obj){
            return obj.name == name;
        });
        response.json(disc);
    });    
});

app.get('/discography/songstatus', function(request, response){
    const collection = db.collection('cartdiscs');
    collection.find({}).toArray(function(err, docs){
        var name = request.query.disc;
        console.log('identifica a: '+name);
        var disc = null;
        disc = docs.find(function(obj){
            return obj.name == name;
        });
        if(disc == null){
            response.send('ADD TO CART');            
        }else{
            response.send('REMOVE FROM CART');
        }
    });    
});

app.post('/discography/addcart', function(request, response){
    var discname = request.body.disc;
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var disc = docs.find(function(obj){
            return obj.name == discname;
        });
        db.collection('cartdiscs').insert(disc);
    });
    response.send('REMOVE FROM CART');   
});

app.post('/discography/removecart', function(request, response){
    var discname = request.body.disc;
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var disc = docs.find(function(obj){
            return obj.name == discname;
        });
        db.collection('cartdiscs').deleteOne(disc);
    });
    response.send('ADD TO CART');
});

app.get('/cart', function(request, response){
    response.render('cart');
});

app.get('/cart/getdiscscart', function(request, response){
    const collection = db.collection('cartdiscs');
    collection.find({}).toArray(function(err, docs){
        response.json(docs);
    });
});

app.post('/cart/removecart', function(request, response){
    var discname = request.body.disc;
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var disc = docs.find(function(obj){
            return obj.name == discname;
        });
        db.collection('cartdiscs').deleteOne(disc);
    });
    response.send('REMOVED');
});

app.get('/discography/updatedisc', function(request, response){
    var type = request.query.type;
    var year = parseInt(request.query.year);
    var price = parseFloat(request.query.price);
    const collection = db.collection('discs');
    collection.find({}).toArray(function(err, docs){
        var newdiscs = docs;
        if(type != "none"){
            console.log('entra a type ****')
            var discsfilter = newdiscs.filter(disc => disc.type == type);
            newdiscs = discsfilter;
        }
        if(year != -1){
            console.log('entra a year ****')
            var discsfilter = newdiscs.filter(disc => disc.year == year);
            newdiscs = discsfilter;
        }
        if(price != -1){
            console.log('entra a price ****')
            var discsfilter = newdiscs.filter(disc => disc.price >= price);
            newdiscs = discsfilter;
        }
        response.json(newdiscs);
    });
});

app.get('/checkout', function(request, response){
    const collection = db.collection('cartdiscs');
    collection.find({}).toArray(function(err, docs){
        var price = 0;
        docs.forEach(element => {
            price+=element.price;
        });
        var discs_items = {
            totalprice: price,
            discs: docs,
        }
        response.render('checkout', discs_items);
    });
});

app.listen(3000);
