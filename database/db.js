const mysql = require('mysql');

//login/register admin

const connection = mysql.createConnection({
    host: 'buo9wypwedjzpaksgday-mysql.services.clever-cloud.com',
    user: 'uypcf3h1etgjk4r2',
    password: 'I5OqxNP6HhJt0givOquO',
    database: 'buo9wypwedjzpaksgday'
});

connection.connect((error) => {
    if(error){
        console.log('el error de la coneccion es: ' + error);
        return;
    }
    console.log('¡Conectdo a la base de datos de login/registro admin');
});

module.exports = connection;

