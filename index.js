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
        if(err){
            console.err("ha fallado en la toma de objetos del servidor");
            return;
        }

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
        if(err){
            console.err("ha fallado en la toma de objetos del servidor");
            return;
        }
        var name = request.query.disc;
        console.log('identifica a: '+name);
        var disc = docs.find(function(obj){
            return obj.name == name;
        });
        console.log(disc);
        response.json(disc);
    });    
});

app.get('/discography/addcart', function(request, response){
    var discname = request.query.disc;
    const collection = db.collection('discs');
    collection.updateOne({name : discname}, { $set: {cart : true}}, function(err, result){
        if(err){
            console.err("ha fallado en modificar dato a: "+discname);
            return;
        }
        console.log("ha modificado dato a: "+discname);
    });
    collection.find({}).toArray(function(err, docs){
        if(err){
            console.err("ha fallado en la toma de objetos del servidor");
            return;
        }
        console.log('identifica a: '+discname);
        var newdisc = docs.find(function(obj){
            return obj.name == discname;
        });
        console.log(newdisc);
        response.json(newdisc);
    });    
});

app.get('/discography/removecart', function(request, response){
    var discname = request.query.disc;
    const collection = db.collection('discs');
    collection.updateOne({name : discname}, { $set: {cart : false}}, function(err, result){
        if(err){
            console.err("ha fallado en modificar dato a: "+discname);
            return;
        }
        console.log("ha modificado dato a: "+discname);
    });
    collection.find({}).toArray(function(err, docs){
        if(err){
            console.err("ha fallado en la toma de objetos del servidor");
            return;
        }
        console.log('identifica a: '+discname);
        var newdisc = docs.find(function(obj){
            return obj.name == discname;
        });
        console.log(newdisc);
        response.json(newdisc);
    });    
});


app.listen(3000);
/*
//instalo body-parser para sacar deatos con post(convierte informacion del body a variables)
//importo body-parser
var bodyparser = require('body-parser');
app.use(bodyparser.json());                   //to support JSON-ecoded bodies
app.use(bodyparser.urlencoded({               //to suppport URL-encoded bodies
    extended: true
}))
//usar body-parser
app.use(express.json());

//definir ruta para agregar personas
app.post('/agregar', function(request, response){
    personas.push({
        nombre: request.body.nombre,
        edad: request.body.edad,
    });
    console.log(request.body);
    response.send('ok, agregado.');
});

//iniciar el servidor en el puerto especificado

//npx nodemon index.js
*/