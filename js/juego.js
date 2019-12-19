//WIREWORLD: Autómata celular que simula circuitos eléctricos
//PROGRAMAR ES INCREÍBLE: presentado por Javier Muñiz
//Puedes ver el tutorial completo, sobre cómo se hizo este código, en este enlace
//https://www.youtube.com/watch?v=P4v1kKlP6Dg

var canvas;
var ctx;
var fps = 13;

var canvasX = 500;  //pixels ancho
var canvasY = 500;  //pixels alto
var tileX, tileY;

//Variables relacionadas con el tablero de juego
var tablero;
var filas = 20;      //100
var columnas = 20;   //100

//COLORES
var amarillo ='#FCDF03';
var azul = '#07d7f7';
var rojo = '#f70707';
var negro = '#000000';


var blanco = '#FFFFFF';


var matriz = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,1,3,2,1,0,0,0,0,0,1,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

];




function creaArray2D(f,c){
  var obj = new Array(f);
  for(y=0; y<f; y++){
    obj[y]= new Array(c);
  }

  return obj;
}


//OBJETO AGENTE O TURMITA

var vacio = 0;
var cable = 1;
var cabeza = 2;
var cola = 3;

var Agente = function(x,y,estado){

  this.x = x;
  this.y = y;
  this.estado = estado;           //vivo = 1, muerto = 0
  this.estadoProx = this.estado;  //estado que tendrá en el siguiente ciclo

  this.vecinos = [];    //guardamos el listado de sus vecinos

  //Método que añade los vecinos del objeto actual
  this.addVecinos = function(){
    var xVecino;
    var yVecino;

    for(i=-1; i<2; i++){
      for(j=-1; j<2; j++){
        xVecino = (this.x + j + columnas) % columnas;
        yVecino = (this.y + i + filas) % filas;



        //descartamos el agente actual (yo no puedo ser mi propio vecino)
        if(i!=0 || j!=0){
          this.vecinos.push(tablero[yVecino][xVecino]);
        }

      }
    }
  }



  this.dibuja = function(){

    var color;

    if(this.estado == 0){
      color = negro;
    }

    if(this.estado == 1){
      color = amarillo;
    }

    if(this.estado == 2){
      color = azul;
    }

    if(this.estado == 3){
      color = rojo;
    }

    ctx.fillStyle = color;
    ctx.fillRect(this.x*tileX, this.y*tileY, tileX, tileY);

  }


  //Programamos las leyes de Wireworld
  this.nuevoCiclo = function(){
    if(this.estado == vacio)
      this.estadoProx = vacio;

    if(this.estado == cabeza)
      this.estadoProx = cola;

    if(this.estado == cola)
      this.estadoProx = cable;

    //------------------------------
    //REGLA DEL CABLE
    if(this.estado == cable){
      var cabezas = 0;

      for(i=0; i<this.vecinos.length; i++){
        if(this.vecinos[i].estado == cabeza){
          cabezas++;
        }
      }

      if(cabezas == 1 || cabezas == 2)
        this.estadoProx = cabeza;
      else
        this.estadoProx = cable;

    }
    //------------------------------


  }


  this.mutacion = function(){
    this.estado = this.estadoProx;
  }



}





function inicializaTablero(obj){

  var estado;

  for(y=0; y<filas; y++){
    for(x=0; x<columnas; x++){
      obj[y][x] = new Agente(x,y,matriz[y][x]);
    }
  }


  for(y=0; y<filas; y++){
    for(x=0; x<columnas; x++){
      obj[y][x].addVecinos();
    }
  }

}


function borraCanvas(){
  canvas.width=canvas.width;
  canvas.height=canvas.height;
}




function inicializa(){

  //Asociamos el canvas
  canvas = document.getElementById('pantalla');
  ctx = canvas.getContext('2d');


  //Ajustamos el tamaño del canvas
  canvas.width = canvasX;
  canvas.height = canvasY;

  //calculamos tamaño tiles
  tileX = Math.floor(canvasX/filas);
  tileY = Math.floor(canvasY/columnas);

  //creamos el tablero
  tablero = creaArray2D(filas,columnas);
  //Lo inicializamos
  inicializaTablero(tablero);



  //Ejecutamos el bucle principal
  setInterval(function(){principal();},1000/fps);

}


function dibujaTablero(obj){

  //DIBUJA LOS AGENTES
  for(y=0; y<filas; y++){
    for(x=0; x<columnas; x++){
      obj[y][x].dibuja();
    }
  }

  //CALCULA EL SIGUIENTE CICLO
  for(y=0; y<filas;y++){
    for(x=0; x<columnas; x++){
      obj[y][x].nuevoCiclo();
    }
  }

  //APLICA LA MUTACIÓN
  for(y=0; y<filas;y++){
    for(x=0; x<columnas; x++){
      obj[y][x].mutacion();
    }
  }

}





function principal(){
  borraCanvas();
  dibujaTablero(tablero);

}
