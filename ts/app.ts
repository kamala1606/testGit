const keysCamps: string[] = ["octeto-1", "octeto-2", "octeto-3", "octeto-4", "mascara-subred"];
const formsKey: string[] = ["form-id"];
const campos: Array<HTMLInputElement> = [];
const RANGO_OCTETOS: {min: number, max: number} = 
{
   min: 0,
   max: 255
};
const RANGO_MASCARA_SUB_RED: {min: number, max: number} = 
{
   min: 0,
   max: 32
};

for(const key of keysCamps)
{
   campos.push(document.forms[0][key]);
}
   
const validarCampos = (funcion: (x: HTMLInputElement) => boolean, ...camps: Array<HTMLInputElement>): boolean => 
{
   let isValid: boolean = false;
   isValid = camps.every(funcion);
   return isValid;
};

const validarVacio = (element: HTMLInputElement): boolean => 
{
   const valor = element.value;
   let resultado = element ? valor != "" : false;
   return resultado;
};

const validarRango = (element: HTMLInputElement, rango: {min:number, max: number}): boolean => 
{
   const cantidad = Number(element.value);
   let resultado = !(cantidad > rango.max || cantidad < rango.min);
   return resultado;
};

let red = new Red("192.168.1.100/24");

const solucionarProblema1 = (): Red | never =>
{ 
   let validarCamposVacios = validarCampos(validarVacio, ...campos);
   let validarRangosCampos: boolean = true;
   const elemento: HTMLInputElement = campos[campos.length - 1];
   const octetos: HTMLInputElement[] = campos.slice(0, 4);
   for(const camp of octetos)
   {
      validarRangosCampos &&= validarRango(camp, RANGO_OCTETOS);
   }
   validarRangosCampos &&= validarRango(elemento, RANGO_MASCARA_SUB_RED);
   
   let direccionIP: string = "";

   if(validarRangosCampos && validarCamposVacios) 
   {
      direccionIP = `${octetos[0].value}.${octetos[1].value}.${octetos[2].value}.${octetos[3].value}/${elemento.value}`;
   }
   const red: Red = new Red(direccionIP);

   return red;
};

const anotarResultados = (): void =>
{
   const keysResultados: string[] = [
      "mascara-subred-decimal",
      "direccion-broadcast",
      "numero-bits-red",
      "numero-bits-host",
      "numero-direcciones-host",
      "rango-direccion-red-broadcast",
      "total-direcciones-1"
   ];

   try {
      let red = solucionarProblema1();
      const camposResultados: HTMLElement[] = [];
      for(const key of keysResultados)
      {
         camposResultados.push(<HTMLElement> document.getElementById(key));
      }
      camposResultados[0].innerHTML = `Máscara de subred en formato decimal: ${red.mascaraDeSubRed[0]}.${red.mascaraDeSubRed[1]}.${red.mascaraDeSubRed[2]}.${red.mascaraDeSubRed[3]}`;
      camposResultados[1].innerHTML = `Dirección de broadcast en la red: ${red.broadCast[0]}.${red.broadCast[1]}.${red.broadCast[2]}.${red.broadCast[3]}`;
      camposResultados[2].innerHTML = `Número de bits para identificar la red: ${red.bitsDeMascara}`;
      camposResultados[3].innerHTML = `Número de bits para identificar los hosts: ${red.bitsDeUsuario}`
      camposResultados[4].innerHTML = `Número de direcciones disponibles para los hosts: ${red.direccionesDeUsuarios.length}`;
      camposResultados[5].innerHTML = `Rango de direcciones indicando la dirección de la red, las direcciones que se pueden asignar a los hosts y la dirección de broadcast: ${red.direccionDeRed[0]}.${red.direccionDeRed[1]}.${red.direccionDeRed[2]}.${red.direccionDeRed[3]} - ${red.broadCast[0]}.${red.broadCast[1]}.${red.broadCast[2]}.${red.broadCast[3]}`;
      camposResultados[6].innerHTML = String(red.direccionesDeUsuarios.length);
      
      rellenarTabla("direcciones-tabla-1", ...red.direccionesDeUsuarios);
   } catch (error) {
      alert(error.message);
   }
};

const rellenarTabla = (idTabla: string, ...elementos: number[][]): void => 
{
   let cadena: string = "";
   let indice = 0;

   const tabla: HTMLElement | null = document.getElementById(idTabla);
   for(const element of elementos)
   {
      cadena += 
      `<tr>
         <td class="celda-tabla text-align-left">${++indice}</td>
         <td class="celda-tabla">${element[0]}</td>
         <td class="celda-tabla">${element[1]}</td>
         <td class="celda-tabla">${element[2]}</td>
         <td class="celda-tabla">${element[3]}</td>
      </tr>`;
   }
   (<HTMLElement> tabla).innerHTML = cadena;
};

function anotarResultados2() 
{
   const keyResultados: string[] = [
      'direccion-red',
      'direccion-broadcast-red',
      'cantidad-host',
      'rango-direcciones',
      'total-direcciones-2',
   ];

   const camposResultados: HTMLInputElement[] = [];
   for(const key of keyResultados) camposResultados.push(<HTMLInputElement> document.getElementById(key));

   try
   {
      const red = solucionarProblema1();
      camposResultados[0].innerHTML = `La dirección de la red: ${red.direccionDeRed.join('.')}`;
      camposResultados[1].innerHTML = `Dirección de broadcast en esa red: ${red.broadCast.join('.')}`;
      camposResultados[2].innerHTML = `La cantidad de host que estan o podrian estar en la red: ${2**red.bitsDeUsuario - 2}`;
      camposResultados[3].innerHTML = `Rango de direcciones indicando la direccion de la red, las direcciones de los hosts y la direccion de broadcast: ${red.direccionDeRed.join('.')} - ${red.broadCast.join('.')}`;
      camposResultados[4].innerHTML = `${2**red.bitsDeUsuario - 2}`;

      rellenarTabla('direcciones-tabla-2', ...red.direccionesDeUsuarios);
   }
   catch (error)
   {
      alert(error.message);
   }
}

function generarAleatorio(): void
{
   const {min: minOcteto, max: maxOcteto}: {min: number, max: number} = RANGO_OCTETOS;
   const {min: minMascara, max: maxMascara}: {min: number, max: number} = RANGO_MASCARA_SUB_RED;

   const octeto1: number = Math.floor(Math.random() * ((maxOcteto-63) - minOcteto) + minOcteto);
   const octeto2: number = Math.floor(Math.random() * (maxOcteto - minOcteto) + minOcteto);
   const octeto3: number = Math.floor(Math.random() * (maxOcteto - minOcteto) + minOcteto);
   const octeto4: number = Math.floor(Math.random() * (maxOcteto - minOcteto) + minOcteto);
   const mascara: number = Math.floor(Math.random() * (maxMascara - minMascara) + minMascara);
   rellenarFormulario(octeto1, octeto2, octeto3, octeto4, mascara);
}

function rellenarFormulario(...direccion: number[])
{
   let i: number = 0;
   for(const campo of campos)
   {
      campo.value = String(direccion[i++]);
   }
}
