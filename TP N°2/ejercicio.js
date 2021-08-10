const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};
const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    var formulario = querystring.parse(info);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head></head><body><script>
    var num=`+formulario['numero']+`;
    var espacio=" ";
    var conjuntoDeEsp="";
    var asterisco="*";
    var circulo="o";
    if(num>0){
    for(var y=0;y<num;y++){
    conjuntoDeEsp=conjuntoDeEsp+espacio;
    }
    conjuntoDeEsp=conjuntoDeEsp+asterisco;
    document.write("."+conjuntoDeEsp+"<br>");
    }
    for (var x=1;x<num;x++){
    conjuntoDeEsp=conjuntoDeEsp.slice(1,conjuntoDeEsp.length);
    conjuntoDeEsp=conjuntoDeEsp+circulo+asterisco;
    document.write("."+conjuntoDeEsp+"<br>");
    }
    </script></body></html>`;
    respuesta.end(pagina);
  });	
}

console.log('Servidor web iniciado');