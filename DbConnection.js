const mysql2 = require('mysql2');
const express = require('express');
class DbConnection{
    constructor(){
        this.connection = mysql2.createConnection({
            host :'database-2.cxc58cunu8h7.us-east-1.rds.amazonaws.com',
            user :'admin',
            password:'Batzz!_JJ1011',
            database: 'projeto_ford'
        });        
    }    

    setConnection(){
        this.connection.connect((err)=>{
            if(err){
                throw err;
            }
            console.log('MySql Connected...');
        });
        const app=express();
        app.listen('3306', ()=>{
            console.log("Server started on port 3306");
        });
    }
    //Connect
    
    getConnection(){
        return this.connection;
    }
}

module.exports = DbConnection;