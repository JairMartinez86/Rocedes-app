import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { IFactorCorte } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte';
import { IFactorCorteDetalle } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte-Detalle';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { FactorCorteService } from 'src/app/main/Services/inv/ProcesoCorte/factor-corte.service';



export interface ISeleccionEstilo {
  Descripcion: string;
  FactorDetalleCorte : Number;
}

@Component({
  selector: 'app-factor-corte-tiempo',
  templateUrl: './factor-corte-tiempo.component.html',
  styleUrls: ['./factor-corte-tiempo.component.css']
})
export class FactorCorteTiempoComponent implements OnInit {

  public val = new Validacion();

  public FechaInicio : Date | undefined;
  public FechaFinal : Date | undefined;

  constructor(private dialog : MatDialog, private _FactorCorteService : FactorCorteService) { 

    this.val.add("txt_Factor_Tiempo_Componente", "1", "LEN>", "0");
    this.val.add("txt_Factor_Tiempo_Estilo", "1", "LEN>", "0");
    this.val.add("txt_Factor_Tiempo_Bulto", "1", "NUM>", "0");
    this.val.add("txt_Factor_Tiempo_Yarda", "1", "NUM>", "0");
    this.val.add("txt_Factor_Tiempo_Fecha", "1", "LEN>", "0");

    
  }

  private Limpiar() : void
  {
    this.FechaInicio = undefined;
    this.FechaFinal = undefined;

    this.val.ValForm.get("txt_Factor_Tiempo_Componente")?.setValue("");
    this.val.ValForm.get("txt_Factor_Tiempo_Estilo")?.setValue("");
    this.val.ValForm.get("txt_Factor_Tiempo_Bulto")?.setValue("1");
    this.val.ValForm.get("txt_Factor_Tiempo_Yarda")?.setValue("1");
    this.val.ValForm.get("txt_Factor_Tiempo_Fecha")?.setValue("");


    this.val.ValForm.reset();
  }


  public Cerrar() : void
  {

  }




  onKeyEnter(event: any){
    

    let _input : string = event.target.id;
    

    if(event.target.value == "") {
      document?.getElementById(_input)?.focus();
      event.preventDefault();
      return;
    }


    switch(_input){

      case "txt_Factor_Tiempo_Componente":
        document?.getElementById("txt_Factor_Tiempo_Bulto")?.focus();
        break;

      case "txt_Factor_Tiempo_Bulto":
        document?.getElementById("txt_Factor_Tiempo_Yarda")?.focus();
      break;

      case "txt_Factor_Tiempo_Yarda":
          document?.getElementById("txt_Factor_Tiempo_Fecha")?.focus();
      break;


       
    }
    

    this.calcularMinutos();

    event.preventDefault();

  }



  
  
  //#region AUTO COMPLETADO COMPONENTE
	
  optionSeleccionComponente : IFactorCorteDetalle[] = [];
  filteredOptionsComponente!: Observable<IFactorCorteDetalle[]>;

  txt_Factor_Tiempo_Componente_onSearchChange(event : any) :void{

  this.optionSeleccionComponente.splice(0, this.optionSeleccionComponente.length);

  let value : string = event.target.value;


  this._FactorCorteService.GetAuto(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((j : IFactorCorteDetalle) => {
          this.optionSeleccionComponente.push(j);
        });

        this.filteredOptionsComponente = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Componente)),
          map(Componente => (Componente ? this._FiltroSeleccion(Componente) : this.optionSeleccionComponente.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });



}





MostrarComponenteSelec(Registro: IFactorCorteDetalle): string {
  if(Registro == null) return "";
  return Registro.Componente;
}

private _FiltroSeleccion(Componente: string): IFactorCorteDetalle[] {
  const filterValue = Componente.toLowerCase();
  
  return this.optionSeleccionComponente.filter(option => option.Componente.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO COMPONENTE


public calcularMinutos() :void
{
  let _Opcion : any = this.val.ValForm.get("txt_Factor_Tiempo_Componente")?.value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionSeleccionComponente.filter( f => f.Componente == this.val.ValForm.get("txt_Factor_Tiempo_Componente")?.value)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_Factor_Tiempo_Componente")?.setValue("");
      return;
    }
    
  }


  let Bultos : number = this.val.ValForm.get("txt_Factor_Tiempo_Bulto")?.value;
  let Yardas : number = this.val.ValForm.get("txt_Factor_Tiempo_Yarda")?.value;



  this._FactorCorteService.GetDetalle(_Opcion.IdFactorDetalleCorte).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        let FilaFactor : IFactorCorte = _json["d"][0];
        let row : IFactorCorteDetalle = _json["d"][1] ;

        let Segundos : number = 0;
        if(row.StraightPerimeter == 0)
        {
    
          Segundos = (FilaFactor.Linearecta + FilaFactor.Curva) / 2;
          Segundos *= row.TotalPerimeter;
          Segundos += FilaFactor.Esquinas * row.TotalCorners;
          Segundos += row.TotalNotches * FilaFactor.Piquetes;
        }
        else
        {
    
          Segundos = row.StraightPerimeter * FilaFactor.Linearecta;
          Segundos += FilaFactor.Curva * row.CurvedPerimeter;
          Segundos += FilaFactor.Esquinas * row.TotalCorners;
          Segundos += row.TotalNotches * FilaFactor.Piquetes;
        }
    
 

      
        let MinutosPieza = Segundos / 60;
        let TotalMinutos : number = Bultos * MinutosPieza;
        TotalMinutos += Yardas * FilaFactor.HacerOrificio;
        TotalMinutos +=  Yardas * FilaFactor.PonerTape;


        let fecha : string = String(this.FechaInicio?.toString());

        var currentDate = new Date(fecha);
        this.FechaFinal = new Date(currentDate.getTime() + TotalMinutos*60000);


      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }



  });

 

}



  ngOnInit(): void {
    this.Limpiar();
  }

}
