const express = require('express');
var cors = require('cors')
var request = require('request');
var dados_dash;

const app = express(),
      bodyParser = require("body-parser");
      port = process.env.PORT || 5000;

app.use(cors());

function requisicao(valor){
  request({
    url: "https://api.powerbi.com/beta/11dbbfe2-89b8-4549-be10-cec364e59551/datasets/ee95b2d9-bfd6-4523-8f05-56f8fb90b7e3/rows?key=244VMgUtaj245PSIjbPt2%2FRekg2yixXxvLW74cvFyB6BozAQV9XhnGFDhGA6ijfP4CFiCZLW4UAGKQvA15rhDQ%3D%3D",
    method: "POST",
    json: true,  
    body: valor
    }, function (error, response, body){
        console.log(valor)
        console.log("requisição enviada");
    });
}

app.use(bodyParser.json());

app.get('/', (req,res) => {
      res.send("Rodando na porta " + port);
});      

app.post('/api/book', (req, res) => {    
    var horas = new Date().getHours()
    var minutos = new Date().getMinutes()
    var horas_ = horas+(minutos/100)
    var da;
    if(minutos>=0 && minutos<30){
      da = `${horas}:00-${horas}:30`
    }else{
      da = `${horas}:30-${horas}:59`
    }   
    console.log(da);
    var dados_recebidos = res.req.body;
    console.log(dados_recebidos);
    var x = res.req.body;
        
    if(dados_recebidos[1]=="uso profissional"){      
      
      dados_dash = [
        {
        "id_usuario" :"1",
        "faixa_idade" : x[0],
        "estado" :"SP",
        "cidade" :"São Paulo",
        "data_consulta" : da,
        "categoria" : dados_recebidos[dados_recebidos.length-1],
        "flag_tem_carro" : "",
        "numero_pessoas_carro" : "",
        "distancia_percorrida" : "",
        "tempo_viagem_carro" : "",
        "estado_porta_malas" : "",
        "tipo_transporte" : dados_recebidos[3],
        "finalidade" : "",
        "flag_estrada" :"",
        "hora":horas_
        }
      ]
      requisicao(dados_dash);
          
    }else if(dados_recebidos[2]=="Sim"){      
      dados_dash = [
        {
        "id_usuario" :"1",
        "faixa_idade" : x[0],
        "estado" :"SP",
        "cidade" :"São Paulo",
        "data_consulta" : da,
        "categoria" : dados_recebidos[dados_recebidos.length-1],
        "flag_tem_carro" : "Sim",
        "numero_pessoas_carro" : dados_recebidos[3],
        "distancia_percorrida" : dados_recebidos[4],
        "tempo_viagem_carro" : dados_recebidos[8],
        "estado_porta_malas" : dados_recebidos[6],
        "tipo_transporte" : 'individual',
        "finalidade" : "",
        "flag_estrada" : dados_recebidos[7],
        "hora":horas_
        }
      ]
      requisicao(dados_dash);
      
    }else{
           
      dados_dash = [
        {
        "id_usuario" :"1",
        "faixa_idade" : x[0],
        "estado" :"SP",
        "cidade" :"São Paulo",
        "data_consulta" : da,
        "categoria" : dados_recebidos[dados_recebidos.length-1],
        "flag_tem_carro" : "Não",
        "numero_pessoas_carro" : dados_recebidos[4],
        "distancia_percorrida" : dados_recebidos[6],
        "tempo_viagem_carro" : "",
        "estado_porta_malas" : "",
        "tipo_transporte" : 'individual',
        "finalidade" : dados_recebidos[3],
        "flag_estrada" : dados_recebidos[7],
        "hora":horas_
        }
      ]
      requisicao(dados_dash);
    }  
    
  });

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
