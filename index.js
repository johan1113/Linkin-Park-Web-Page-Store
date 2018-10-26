const express = require('express');
const hbs = require('express-handlebars');

const app = express();

//para definir la carpeta publica
app.use(express.static('public'));
//para registrar el motor de render handlebars
app.engine('handlebars', hbs());
//para setear el motor de render a utilizar
app.set('view engine', 'handlebars');


//importar archivo discs.js
var discs = require('./discs.js');
console.log('discs: ',discs);

//defninir ruta root o principal
app.get('/', function(request, response){
    response.render('home');
});

app.get('/discography', function(request, response){
    var discs_items = {
        filter: "ALL",
        discs: discs,
    }
    response.render('discography', discs_items);
});

app.get('/discography/song', function(request, response){
    var name = request.query.disc;
    console.log('identifica a: '+name);
    var disc = discs.find(function(obj){
        return obj.name == name;
    });
    console.log(disc);
    response.json(disc);
    
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