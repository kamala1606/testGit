class Red
{
   private _direccion: number[];

   private _mascaraDeSubRed: number[];

   private _broadCast: number[];

   private _direccionDeRed: number[];
   
   private _direccionesDeUsuarios: number[][];

   private _bitsDeMascara: number;

   private _bitsDeUsuario: number;

   constructor(direccionIP: string)
   {
      let direccionIntepretada = this.interpretarDireccionIP(direccionIP);
      this._mascaraDeSubRed = this.generarMascaraDeSubRed(direccionIntepretada[4]);
      this._direccion = direccionIntepretada.slice(0, 4);
      this._direccionDeRed = Red.obtenerDireccionRed(this._direccion, this.mascaraDeSubRed);
      this._bitsDeMascara = direccionIntepretada[4];
      this._bitsDeUsuario = 32 - this._bitsDeMascara;
      this._direccionesDeUsuarios = this.listarDireccionesDeUsuario();
      this._broadCast = this.incrementarIPUsuario(...this.direccionesDeUsuarios[this.direccionesDeUsuarios.length - 1]);
   }

   private interpretarDireccionIP(direccion: string): number[] | never
   {
      const direccionIp: number[] = [];
      const separado: string[] = direccion.split("/");

      separado.splice(0, 1, ...separado[0].split(".")); 

      if(separado.length < 5)
      {
         throw new ExcepcionDireccionIP("La ip es incorrecta o fue no esta completa");
      }

      for(const octeto of separado) 
      {
         direccionIp.push(+octeto);
      }

      return direccionIp;
   }

   private incrementarIPUsuario(...direccion: number[])
   {
      const direccionNueva: number[] = [...direccion]; 
      let octeto: number = 3; 
      ++direccionNueva[octeto];
      while(direccionNueva[octeto] > 255 && octeto >= 0)
      {
         direccionNueva[octeto--] = 0;
         ++direccionNueva[octeto > 0 ? octeto : 0];
      }
      return direccionNueva;
   }

   private generarMascaraDeSubRed(bits: number): number[]
   {
      const mascarSubRedDecimal: number[] = [0, 0, 0, 0];
      const nOctetosCompletos = Math.floor(bits/8);
      for(let i=0; i<nOctetosCompletos; i++)
      {
         mascarSubRedDecimal[i] = 255;
      }
      const bitsSobrantes = bits%8;
      let indice = nOctetosCompletos;
      for(let i=0; i<bitsSobrantes; i++)
      {
         mascarSubRedDecimal[indice] += 2**(7-i);
      }
      return mascarSubRedDecimal;
   }

   private listarDireccionesDeUsuario(): number[][]
   {
      const direccionesIP: number[][] = [[]];
      direccionesIP[0] = this.incrementarIPUsuario(...this.direccionDeRed);
      let limiteDirecciones = 2**this.bitsDeUsuario - 3;
      for(let i=0; i<limiteDirecciones; i++)
      {
         direccionesIP.push(this.incrementarIPUsuario(...direccionesIP[i]));
      }
      return direccionesIP;
   }

   static obtenerDireccionRed(direccion: number[], mascara: number[]): number[]
   { 
      const direccionDeRed: number[] = [];
      for(let i=0; i<direccion.length; i++)
      {
         direccionDeRed.push(mascara[i] & direccion[i]);
      }
      return direccionDeRed;
   }

   get direccionDeRed()
   {
      return this._direccionDeRed;
   }

   get mascaraDeSubRed(): number[]
   {
      return this._mascaraDeSubRed;
   }

   get broadCast(): number[]
   {
      return this._broadCast;
   }

   get direccion(): number[]
   {
      return this._direccion;
   }

   get direccionesDeUsuarios()
   {
      return this._direccionesDeUsuarios;
   }

   get bitsDeMascara()
   {
      return this._bitsDeMascara;
   }

   get bitsDeUsuario()
   {
      return this._bitsDeUsuario;
   }
}