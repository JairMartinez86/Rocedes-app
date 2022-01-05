import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { IFoleoDatos } from 'src/app/main/class/Form/Inv/Interface/i-Foleo-Datos';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { FoleoDatosService } from 'src/app/main/Services/inv/ProcesoFoleo/foleo-datos.service';

export interface IFlujoCorte {

  Operacion : string;
  Descripcion : string;
  Manual : number;
  Doble: number;
  Sencilla: number;
}

let ELEMENT_DATA_FACTOR_FOLEO : IFlujoCorte[] = [
  {Operacion : "TENDIDO", Descripcion : "CANTIDAD DE CAPAS", Manual : 0, Doble : 0 , Sencilla : 0},
  {Operacion : "TENDIDO", Descripcion : "LONGITUD DE MARKERS", Manual : 0, Doble : 0 , Sencilla : 0},
  {Operacion : "TENDIDO", Descripcion : "CANTIDAD DE ROLLOS UTILIZADOS", Manual : 0, Doble : 0 , Sencilla : 0},

  {Operacion : "CORTE", Descripcion : "BULTOS", Manual : 0, Doble : 0 , Sencilla : 0},
  {Operacion : "CORTE", Descripcion : "PERSONAS", Manual : 0, Doble : 0 , Sencilla : 0},

  {Operacion : "FOLEO", Descripcion : "CANTIDAD DE PERSONAS EN PARTES PEQUEÑAS", Manual : 0, Doble : 0 , Sencilla : 0},
  {Operacion : "FOLEO", Descripcion : "CANTIDAD DE PERSONAS EN PARTES GRANDES", Manual : 0, Doble : 0 , Sencilla : 0}


]; 


@Component({
  selector: 'app-flujo-corte',
  templateUrl: './flujo-corte.component.html',
  styleUrls: ['./flujo-corte.component.css']
})
export class FlujoCorteComponent implements OnInit {

  public val = new Validacion();

  public FechaInicio : Date | undefined;
  public FechaFinal : Date | undefined;
  public num_Minutos : number = 0;
  public num_Horas : number = 0;
  public DatosFoleo : IFoleoDatos = {} as IFoleoDatos;

  public Open : boolean = false;

  public Link : string = "";
  public str_Titulo_Tiempo : string = "";
  public str_Estilo : string = "";


  displayedColumns: string[] = ["Operacion", "Descripcion",  "Manual", "Doble", "Sencilla"];
  spanningColumns = ["Operacion"];
  dataSourceFlujoCorte = new MatTableDataSource(ELEMENT_DATA_FACTOR_FOLEO);
  clickedRows = new Set<IFoleoDatos>();
  spans : any[] = [];


  constructor(private dialog : MatDialog, private _FoleoDatosService : FoleoDatosService) { 

    this.cacheSpan("Operacion", (d : any) => d.Operacion);

    this.val.add("txt_flujo_Estilo", "1", "LEN>", "0");
    this.val.add("txt_flujo_Corte", "1", "LEN>", "0");
    this.val.add("txt_flujo_Seccion", "1", "LEN>=", "0");
    this.val.add("txt_flujo_Jornada", "1", "NUM>", "0");
    this.val.add("txt_flujo_Pago", "1", "NUM>", "0");
    
    
  }


  cacheSpan(key : any, accessor : any) {
    for (let i = 0; i < ELEMENT_DATA_FACTOR_FOLEO.length;) {
      let currentValue = accessor(ELEMENT_DATA_FACTOR_FOLEO[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < ELEMENT_DATA_FACTOR_FOLEO.length; j++) {        
        if (currentValue != accessor(ELEMENT_DATA_FACTOR_FOLEO[j])) {
          break;
        }

        count++;
      } 

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col : any, index : number) {
    return this.spans[index] && this.spans[index][col];
  }


  private Limpiar() : void
  {
    this.str_Estilo = "";
    this.num_Horas = 0;
    this.num_Minutos = 0;
    this.FechaInicio = undefined;
    this.FechaFinal = undefined;
   
    this.val.ValForm.reset();


    this.val.ValForm.get("txt_flujo_Estilo")?.setValue("");
    this.val.ValForm.get("txt_flujo_Corte")?.setValue("");
    this.val.ValForm.get("txt_flujo_Seccion")?.setValue("");
    this.val.ValForm.get("txt_flujo_Jornada")?.setValue("660");
    this.val.ValForm.get("txt_flujo_Pago")?.setValue("500");

    
  }


  public Cerrar() : void
  {
    this.Open = false;
  }




  onKeyEnter(event: any){
    

    let _input : string = event.target.id;
    

    if(event.target.value == "") {
      document?.getElementById(_input)?.focus();
      event.preventDefault();
      return;
    }


    switch(_input){

      case "txt_foleo_Estilo":
        document?.getElementById("txt_Foleo_Cant_Bulto")?.focus();
        break;

      case "txt_Foleo_Cant_Bulto":
        document?.getElementById("txt_Foleo_Cant_Capas")?.focus();
      break;

      case "txt_Foleo_Cant_Capas":
        document?.getElementById("txt_Foleo_Cant_Personas_Pieza_Pequeña")?.focus();
      break;

      case "txt_Foleo_Cant_Personas_Pieza_Pequeña":
          document?.getElementById("txt_Foleo_Cant_Personas_Pieza_Grande")?.focus();
      break;

      case "txt_Foleo_Cant_Personas_Pieza_Grande":
        document?.getElementById("txt_Factor_Tiempo_Fecha")?.focus();
      break;


       
    }
    
    this.calcularMinutos();
    event.preventDefault();

  }



  
  
  //#region AUTO COMPLETADO COMPONENTE
	
  optionSeleccion : IFoleoDatos[] = [];
  filteredOptions!: Observable<IFoleoDatos[]>;

  txt_flujo_Estilo_onSearchChange(event : any) :void{

  this.optionSeleccion.splice(0, this.optionSeleccion.length);

  let value : string = event.target.value;


  if(value.length <= 2) return;



  this._FoleoDatosService.GetEstilo(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((j : IFoleoDatos) => {
          this.optionSeleccion.push(j);
        });

        this.filteredOptions = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Estilo)),
          map(Estilo => (Estilo ? this._FiltroSeleccion(Estilo) : this.optionSeleccion.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });



}





MostrarSelec(Registro: IFoleoDatos): string {
  if(Registro == null) return "";
  return Registro.Estilo;
}

private _FiltroSeleccion(Componente: string): IFoleoDatos[] {
  const filterValue = Componente.toLowerCase();
  
  return this.optionSeleccion.filter(option => option.Estilo.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO COMPONENTE


calcularMinutos() : void
{

}

exportar() : void
{

}

    
  ngOnInit(): void {
    this.Limpiar();
    this.Open = true;
  }

}