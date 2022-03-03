const express = require('express');
const app = express();
var mongo = require('mongodb');
var bodyParser=require('body-parser');
var fs = require('fs');

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json());
app.listen('3000', function() {
  console.log('Servidor web escuchando en el puerto 3000');
});

const urlBaseDeDatos = 'mongodb://localhost/harry';

var MongoClient = mongo.MongoClient;
var datosAplicacion;
const NOMBRE_FICHERO = 'harry-potter-characters.json';
cargarDatosJSON(NOMBRE_FICHERO);

app.get('/importar', async(req, res) => {
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, db) {
        if (error) {
            throw error;
        }
        var dbo = db.db("harry");
        dbo.createCollection("personajes", function (err, res2) {

        console.log("Colección creada!");
        dbo.collection('personajes').insertMany(datosAplicacion);
        //db.close();
        });
        
        console.log("Base de datos Harry creada correctamente");

    });
});

app.get('/inicio', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/crearPersonaje', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection('personajes').insertOne(req.body);
        res.end("Creado el personaje "+req.body.name);
    });
});



app.delete('/borrarPersonaje:nombre', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        let nombre = req.params.nombre;
        var dbo = db.db("harry")
        dbo.collection("personajes").deleteOne({name:nombre}, function(err, obj) {
            if (err) throw err;
            res.end("Eliminado el personaje "+nombre);
            db.close();
          });
    });
});

app.get('/humanos', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({ species: "human" }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});


app.get('/anioMenor1979', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({yearOfBirth:{$lt:1979}}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.get('/holly', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");

        dbo.collection("personajes").find({"wand.wood":"holly"}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.get('/estudiantesvivos', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({alive:true,hogwartsStudent:true}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

function cargarDatosJSON(fichero) 
{
    fs.readFile(fichero, 'utf8', function(err, datos) 
    {
        if (err) 
        {
            console.log('No existe el fichero, creando nuevo conjunto de datos');
            datosAplicacion = [];
        }
        else
        {
            console.log('Datos cargados');
            datosAplicacion = JSON.parse(datos);
        }
    });
}


