import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { IFactorCorte } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte';
import { IFactorCorteDetalle } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte-Detalle';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { FactorCorteService } from 'src/app/main/Services/inv/ProcesoCorte/factor-corte.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { ImagenLogo } from 'src/app/main/Base64/logo';


let ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO: IExcelFactorCorteTiempo[] = [];


export interface IExcelFactorCorteTiempo {
  Componente: string;
  Estilo : string;
  Minutos_Pza: number;
  Bultos : number;
  Yardas : number;
  CantPersonas : number;
  Incio : string;
  Fin : string;
}


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
  public num_Minutos : number = 0;
  public FactorDetalle : IFactorCorteDetalle = {} as IFactorCorteDetalle;

  public Open : boolean = false;

  constructor(private dialog : MatDialog, private _FactorCorteService : FactorCorteService) { 

    this.val.add("txt_Factor_Tiempo_Componente", "1", "LEN>", "0");
    this.val.add("txt_Factor_Tiempo_Estilo", "1", "LEN>", "0");
    this.val.add("txt_Factor_Tiempo_Bulto", "1", "NUM>", "0");
    this.val.add("txt_Factor_Tiempo_Yarda", "1", "NUM>", "0");
    this.val.add("txt_Factor_Tiempo_personas", "1", "NUM>", "0");
    this.val.add("txt_Factor_Tiempo_Fecha", "1", "LEN>", "0");
    this.val.add("txt_Factor_TiempoFinal", "1", "LEN>=", "0");
    
    
    
  }

  private Limpiar() : void
  {
    this.num_Minutos = 0;
    this.FechaInicio = undefined;
    this.FechaFinal = undefined;
   

    this.val.ValForm.get("txt_Factor_Tiempo_Componente")?.setValue("");
    this.val.ValForm.get("txt_Factor_Tiempo_Estilo")?.setValue("");
    this.val.ValForm.get("txt_Factor_Tiempo_Bulto")?.setValue("1");
    this.val.ValForm.get("txt_Factor_Tiempo_Yarda")?.setValue("1");
    this.val.ValForm.get("txt_Factor_Tiempo_personas")?.setValue("1");
    this.val.ValForm.get("txt_Factor_Tiempo_Fecha")?.setValue("");
    this.val.ValForm.get("txt_Factor_TiempoFinal")?.setValue("");
    
 
    this.val.ValForm.reset();
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

      case "txt_Factor_Tiempo_Componente":
        document?.getElementById("txt_Factor_Tiempo_Bulto")?.focus();
        break;

      case "txt_Factor_Tiempo_Bulto":
        document?.getElementById("txt_Factor_Tiempo_Yarda")?.focus();
      break;

      case "txt_Factor_Tiempo_Yarda":
        document?.getElementById("txt_Factor_Tiempo_personas")?.focus();
      break;

      case "txt_Factor_Tiempo_personas":
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


  if(value.length <= 2) return;



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
  let CantPersonas : number = this.val.ValForm.get("txt_Factor_Tiempo_personas")?.value;



  this._FactorCorteService.GetDetalle(_Opcion.IdFactorDetalleCorte).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        let FilaFactor : IFactorCorte = _json["d"][0];
        this.FactorDetalle  = _json["d"][1] ;

        let Segundos : number = 0;
        if(this.FactorDetalle.StraightPerimeter == 0)
        {
    
          Segundos = (FilaFactor.Linearecta + FilaFactor.Curva) / 2;
          Segundos *= this.FactorDetalle.TotalPerimeter;
          Segundos += FilaFactor.Esquinas * this.FactorDetalle.TotalCorners;
          Segundos += this.FactorDetalle.TotalNotches * FilaFactor.Piquetes;
        }
        else
        {
    
          Segundos = this.FactorDetalle.StraightPerimeter * FilaFactor.Linearecta;
          Segundos += FilaFactor.Curva * this.FactorDetalle.CurvedPerimeter;
          Segundos += FilaFactor.Esquinas * this.FactorDetalle.TotalCorners;
          Segundos += this.FactorDetalle.TotalNotches * FilaFactor.Piquetes;
        }
    
        Segundos *= 4 / CantPersonas;

      
        let MinutosPieza = Segundos / 60;
        this.FactorDetalle.Minutos_Pza = MinutosPieza;
        let TotalMinutos : number = Bultos * MinutosPieza;
        TotalMinutos += Yardas * FilaFactor.HacerOrificio;
        TotalMinutos +=  Yardas * FilaFactor.PonerTape;


        let fecha : string = String(this.FechaInicio?.toString());

        var currentDate = new Date(fecha);
        this.FechaFinal = new Date(currentDate.getTime() + TotalMinutos*60000);
        this.num_Minutos = Number(TotalMinutos.toFixed(4));

      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }



  });

 

}


sTyleHeader(worksheet : any, cel : string[], line : number) : void
{
  cel.forEach((c : string) => {
    worksheet.getCell(c + line).font = {
      name: 'Arial BlackS',
      family: 2,
      size: 11,
      underline: false,
      italic: false,
      bold: true,
      color: { argb: 'FFFFFF' }
    };

    worksheet.getCell(c + line).fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'006699'},
    };
    
    
    worksheet.getCell(c + line).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  
}


exportar(): void {


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
  let CantPersonas : number = this.val.ValForm.get("txt_Factor_Tiempo_personas")?.value;

  ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO.splice(0, ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO.length);

  var datePipe = new DatePipe("en-GB");

  
  let excel : IExcelFactorCorteTiempo = {} as IExcelFactorCorteTiempo;
  excel.Componente = this.FactorDetalle.Componente;
  excel.Estilo = this.FactorDetalle.Estilo;
  excel.Minutos_Pza = this.FactorDetalle.Minutos_Pza;
  excel.Bultos = Bultos;
  excel.Yardas = Yardas;
  excel.CantPersonas = CantPersonas;
  excel.Incio = String(datePipe.transform(this.FechaInicio, 'dd/MM/yyyy hh:mm:ss'));
  excel.Fin =  String(datePipe.transform(this.FechaFinal, 'dd/MM/yyyy hh:mm:ss'));

  ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO.push(excel);




   //create new excel work book
  let workbook = new Workbook();

  //add name to sheet
  let worksheet = workbook.addWorksheet("TIEMPO DE CORTE");

  let int_Linea = 6;





  //add column name
  let header=["Componente", "Estilo", "Minutos",  "Bultos", "Longitud Marker", "Cantidad Personas", "Inicio", "Fin"]
 

  worksheet.addRow([]);
  worksheet.addRow(["TIEMPO DE CORTE"]);

  worksheet.mergeCells("A2:H4")
  worksheet.getCell("A2").font = {
    name: 'Arial BlackS',
    family: 2,
    size: 18,
    underline: false,
    italic: false,
    bold: true,
    color: { argb: 'FFFFFF' }
  };

  worksheet.getCell("A2").fill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'1C394F'},
  };
  
  var Imagen = (new ImagenLogo()).Logo();

  var imageId1 = workbook.addImage({ 
     base64: Imagen,
     extension: 'png',
  });
  

  worksheet.addImage(imageId1, 'A2:A4');

  worksheet.getCell("A2").alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]);
  worksheet.addRow(header);
  this.sTyleHeader(worksheet, ["A", "B", "C", "D", "E", "F", "G", "H"],  int_Linea)


  worksheet.getCell("K" + int_Linea).alignment = { vertical: 'middle', horizontal: 'center' };


  for (let i = 0; i < ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO.length; i++)
  {
   
    let x2  = Object.values(ELEMENT_EXCEL_FACTOR_CORTE_TIEMPO[i]);
    let temp=[]
    for(let y = 0; y < x2.length; y++)
    {
      temp.push(x2[y])
    }
    worksheet.addRow(temp)
    int_Linea ++;


  }

 // worksheet.spliceColumns(13, 1);
  worksheet.properties.defaultColWidth = 20;


  //set downloadable file name
    let fname="factor-corte-tiempo"

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });


  }



  ngOnInit(): void {
    this.Limpiar();
    this.Open = true;
  }

}
