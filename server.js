const express = require('express');
var cors = require('cors')
const DbConnection = require('./DbConnection')
var connection = new DbConnection();
connection.setConnection();
database = connection.getConnection();
var request = require('request');

const app = express(),
      bodyParser = require("body-parser");
      port = process.env.port || 3080;

app.use(cors());

function requisicao(valor){
  request({
    url: "https://api.powerbi.com/beta/11dbbfe2-89b8-4549-be10-cec364e59551/datasets/ee95b2d9-bfd6-4523-8f05-56f8fb90b7e3/rows?key=244VMgUtaj245PSIjbPt2%2FRekg2yixXxvLW74cvFyB6BozAQV9XhnGFDhGA6ijfP4CFiCZLW4UAGKQvA15rhDQ%3D%3D",
    method: "POST",
    json: true,  
    body: valor
    }, function (error, response, body){
        console.log("requisição enviada");
    });
}

function seleciona_dados(){
  let c = "SELECT * FROM rota_unificada WHERE id_usuario=(SELECT MAX(id_usuario) FROM rota_unificada);"
  database.query(c, (err, rows, inf)=>{
    if(err){
      console.log("Erro na seleção!");
    }else{
      console.log("Seleção feita!")
      console.log(rows);
      requisicao(rows);
    }
  });
}

function consulta_banco(consulta){
  database.query(consulta, (err, rows, inf)=>{
    console.log(consulta)
    if(err){
      console.log("Erro na inserção");
    }else{
      console.log("Inserção realizada!")
      seleciona_dados()
    }
  });
}

app.use(bodyParser.json());

app.get('/', (req,res) => {
      res.send("Rodando na porta " + port);
});      

app.post('/api/book', (req, res) => {
    // console.log(res)
    //console.log(req)
    //console.log("-------------------")
    var horas = new Date().getHours()
    var minutos = new Date().getMinutes()
    var da;
    if(minutos>=0 && minutos<30){
      da = `${horas}:00-${horas}:30`
    }else{
      da = `${horas}:30-${horas}:59`
    }
    //var da = `${new Date().getHours()+1}:${new Date().getMinutes()}`
    console.log(da);
    var dados_recebidos = res.req.body;
    console.log(dados_recebidos);
    var x = res.req.body;
    var consulta_main;
    // consulta_main = `INSERT INTO rota_unificada(estado, cidade, faixa_idade, data_consulta, categoria,
    //   flag_tem_carro,distancia_percorrida,tempo_viagem_carro,estado_porta_malas,tipo_transporte,finalidade,
    //   flag_estrada)
    // VALUES('SP', 'São Paulo', 
    // '${x[0]}','${da}', '${dados_recebidos[dados_recebidos.length-1]}');`
    
    if(dados_recebidos[1]=="uso profissional"){      
      consulta_main = `INSERT INTO rota_unificada(estado, cidade, faixa_idade, data_consulta, categoria,
      tipo_transporte)
      VALUES('SP', 'São Paulo', 
      '${x[0]}','${da}', '${dados_recebidos[dados_recebidos.length-1]}', '${dados_recebidos[3]}');`
      consulta_banco(consulta_main);          
    }else if(dados_recebidos[2]=="Sim"){
      consulta_main = `INSERT INTO rota_unificada(estado, cidade, faixa_idade, data_consulta, categoria,
        flag_tem_carro,distancia_percorrida,tempo_viagem_carro,estado_porta_malas,tipo_transporte,
        flag_estrada)
      VALUES('SP', 'São Paulo', 
      '${x[0]}','${da}', '${dados_recebidos[dados_recebidos.length-1]}','Sim','${dados_recebidos[4]}',
      '${dados_recebidos[8]}','${dados_recebidos[6]}', 'individual', '${dados_recebidos[7]}');`
      consulta_banco(consulta_main);
    }else{
      consulta_main = `INSERT INTO rota_unificada(estado, cidade, faixa_idade, data_consulta, categoria,
        flag_tem_carro,distancia_percorrida,tipo_transporte,finalidade,
        flag_estrada)
      VALUES('SP', 'São Paulo', 
      '${x[0]}','${da}', '${dados_recebidos[dados_recebidos.length-1]}', 'Não', '${dados_recebidos[6]}',
      'individual', '${dados_recebidos[3]}', '${dados_recebidos[7]}');`
      consulta_banco(consulta_main);
    }  
    
  });

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
