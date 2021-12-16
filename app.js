//requerimos y guardamos en constantes los modulos 

const express = require('express');
const app = express(); //para poder utilizar los metodos de express

//seteamos urlencoded para capturar los datos des formulario
app.use(express.urlencoded({extended: false}));
app.use(express.json());//espesificamos que trabajaremos con json

//directorio public
app.use('/resources', express.static('public'));//cuando llamemos a resources estaremos llamando a public
app.use('/resources', express.static(__dirname + '/public'))//__dirname es para llevar el proyyecto a otros equipos, pc


//establesemos el motro de plantillas ejs
app.set('views engine', 'ejs'); 


//invocamos bcryptjs para encriptar en password
const bcryptjs = require('bcryptjs');


//invocamos express-session para configurar las variables de session
const session = require('express-session');

app.use(session({
    secret: 'secret',//para que la clave secreta
    resave: true,//forma en la que se guardara las seciones 
    saveUninitialized: true
}));



//invocamos a los modulos de coneccion de las bases de datos
const connection = require('./database/db');
/* const connection = require('./database/db_reserva');
const connection = require('./database/db_comentario');
const connection = require('./database/db_carta'); */



//restablesemos las rutas 
app.get('/index', (req, res) => {
    res.render('index.ejs')
});

app.get('/menu', (req, res) => {
    res.render('menu.ejs')
});

app.get('/comentario', (req, res) => {
    res.render('comentario.ejs')
});

app.get('/AdminCarta', (req, res) => {
    res.render('admin_carta.ejs')
});

app.get('/reserva', (req, res) => {
    res.render('reserva.ejs');
});

app.get('/admin', (req, res) => {
    res.render('admin   .ejs');
});



//parte del admin
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});



//redimenciones del admin

app.get('/AdminReserva', (req, res) => {

    connection.query('SELECT * FROM usuario', (err, usuario) => {
        if (err) {
            res.json(err);
        }else{
            res.render('admin_reserva.ejs', {usuario:usuario})
        }
        
    })
    
});

app.get('/AdminComent', (req, res) => {
    connection.query('SELECT * FROM comentario', (err, comentario) => {
        if (err) {
            res.json(err);
        }else{
            res.render('admin_comet.ejs', {comentario:comentario})
        }
        
    })
});

app.get('/carta', async (req, res) => {
    

    connection.query('SELECT * FROM platos', (err, platos) => {
        if (err) {
            res.json(err);
        }else{
            res.render('carta.ejs', {platos:platos});
        }
    })
});



// registration admin
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);//el pass lo guardamos encriptada

    
    //hacemos una consulta a la tabla
    connection.query('INSERT INTO users set ?', {users:user, name:name, rol:rol, pass:passwordHaash}, async(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.render('register.ejs',{//pasamos los paramatros para sweetalert2
                alert: true,//controla que todo este bien
                alertTitle: "Registration",//el titulo de la alerta
                alertMessage: "¡Successful Registration!",//el mensaje que mostramos en la alerta
                alertIcon: "success",//elegimos el icono, success = es un check 
                showConfirmButton: false,//boton de confirmar no aparesca
                timer: 1500,//el tiempo esta en 1.5 segundos 
                ruta: ''
            })
        }
    })
})


//reserva cliente
app.post('/reserva', async (req, res) => {
    const data = req.body;

    connection.query('INSERT INTO usuario set ?', [data], async(error, usuario) =>{
        if(error){
            console.log(error);
        }else{
            res.render('reserva.ejs',{
                alert: true,
                alertTitle: "Enviado",
                alertMessage: "¡Successful Comment!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
});


//platos cliente
app.post('/AdminCarta', (req, res) => {
    const data = req.body;

    connection.query('UPDATE platos set ? WHERE id = "1"', [data], async(error, platos) =>{
        /* console.log(data); */
        if(error){
            console.log(error);
        }else{
            res.render('admin_carta.ejs',{
                alert: true,
                alertTitle: "Enviado",
                alertMessage: "¡Successful Comment!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    });
});


//comentarios cliente
app.post('/comentario', async (req, res) => {
    const nombre = req.body.nombre;
    const comentario = req.body.comentario;

    connection.query('INSERT INTO comentario set ?', {nombre:nombre, comentario:comentario}, async(error, results) =>{
        if(error){
            console.log(error);
        }else{
            res.render('comentario.ejs',{
                alert: true,
                alertTitle: "Enviado",
                alertMessage: "¡Successful Comment!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})



//autentication del login
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE users = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {//preguntamos por la logitud de los resultados si es igual a 0 o mo coiside el pass
                res.render('login.ejs', {
                    alert: true,
                    alertTitle: "ERROR",
                    alertMessage: "Usuario y/o contraseña incorrectos", 
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].name
                req.session.rol = results[0].rol
                res.render('login.ejs', {
                    alert: true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage: "¡LOGIN CORRECTO!", 
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                })
            }
        })
    }else{
        res.render('login.ejs', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingrese un usuario y/o contraseña!", 
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        })
    }
})


//auth pages
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('admin.ejs',{
            login: true,
            name: req.session.name,
            rol: req.session.rol,
        });
    }else{
        res.render('admin.ejs',{
            login: false,
            name: 'debe iniciar sesion'
        })
    }
});



//declaramos el puerto que utilizaremos
app.listen(3000, (req, res) => {
    console.log('el servidoe esta ejecutandoce');
});
