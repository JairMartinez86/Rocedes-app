import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { IDataMachine } from 'src/app/main/class/Form/PRM/i-data-machine';
import { IMethodAnalysis } from 'src/app/main/class/Form/PRM/i-Method-Analysis';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { OperacionesService } from 'src/app/main/Services/Prm/Operaciones/operaciones.service';
import { LoginService } from 'src/app/main/Services/Usuario/login.service';

let ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS : IParametroMethodAnalysis[] = []
let ELEMENT_DATA_METHOD_ANALISIS : IMethodAnalysis[] = []


export interface IParametroMethodAnalysis {
  Index : number;
  Parametro : string;
  Valor : any;
}

@Component({
  selector: 'app-method-analysis',
  templateUrl: './method-analysis.component.html',
  styleUrls: ['./method-analysis.component.css']
})
export class MethodAnalysisComponent implements OnInit {

  public val = new Validacion();
  
  public Open : boolean = false;
  public Link : string = "";

  private _RowMaquina !: IDataMachine;

  displayedColumns_parametros_method_analisys: string[] = ["Index", "Parametro",   "Valor"];
  dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);


  displayedColumns_method_analisys: string[] = ["IdMethodAnalysis", "Codigo1", "Codigo2", "Codigo3", "Codigo4", "Descripcion", "Freq", "Tmus", "Sec", "Sam", "Eliminar"];
  dataSource_method_analisys = new MatTableDataSource(ELEMENT_DATA_METHOD_ANALISIS);
  clickedRows = new Set<IMethodAnalysis>();

  constructor(private _LoginService : LoginService, private _OperacionesService : OperacionesService, private dialog : MatDialog) {
    this.val.add("txt_method_analisys_parametro1", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro2", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_Maquina", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_parametro4", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro5", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro6", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro7", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro8", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro9", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro10", "", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro11", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro12", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro13", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro14", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro15", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro16", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro17", "1", "LEN>=", "0");
   }

   

   Limpiar(): void
   {
    ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS = [
      {Index : 1, Parametro : "ANALISTA", Valor : this._LoginService.str_user},
      {Index : 2, Parametro : "NOMBRE DE LA OPERACION", Valor : null},
      {Index : 3, Parametro : "TIPO DE MAQUINA", Valor : null},
      {Index : 4, Parametro : "PUNTADAS POR PUGADAS", Valor : 0},
      {Index : 5, Parametro : "MANEJO DE PAQUETE", Valor : null},
      {Index : 6, Parametro : "RATE C$", Valor : 0},
      {Index : 7, Parametro : "JORNADA LABORAL", Valor : 0},
      {Index : 8, Parametro : "TIPO DE TELA", Valor : null},
      {Index : 9, Parametro : "ONZAJE DE TELA", Valor : null},
      {Index : 10, Parametro : "MATERIA PRIMA 1", Valor : null},
      {Index : 11, Parametro : "MATERIA PRIMA 2", Valor : null},
      {Index : 12, Parametro : "MATERIA PRIMA 3", Valor : null},
      {Index : 13, Parametro : "MATERIA PRIMA 4", Valor : null},
      {Index : 14, Parametro : "MATERIA PRIMA 5", Valor : null},
      {Index : 15, Parametro : "MATERIA PRIMA 7", Valor : null},
      {Index : 16, Parametro : "PARTE DE SECCION", Valor : null},
      {Index : 17, Parametro : "TIPO DE CONSTRUCCION", Valor : null}
    ];

    this.dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);
   }
 

   
   Cerrar() :void
   {
     this.Limpiar();
     this.Link = "";
     this.Open = false;
   }
 

 
  //#region EVENTOS TABLA 2
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource_method_analisys.filter = filtro.trim().toLowerCase();
  }  



  
  //#region AUTO COMPLETADO COMPONENTE
	
  optionSeleccion : IDataMachine[] = [];
  filteredOptions!: Observable<IDataMachine[]>;

  txt_method_analisys_Maquina_onSearchChange(event : any) :void{

  
  let value : string = event.target.value;


  if(value.length <= 2) return;

  this.optionSeleccion.splice(0, this.optionSeleccion.length);


  this._OperacionesService.GetDataMachineAuto(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((j : IDataMachine) => {
          this.optionSeleccion.push(j);
        });

        this.filteredOptions = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Name)),
          map(Name => (Name ? this._FiltroSeleccion(Name) : this.optionSeleccion.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });



}


txt_method_analisys_Maquina_onFocusOutEvent(event: any) :void
{

  let _Opcion : any = (<HTMLInputElement>document.getElementById("txt_method_analisys_Maquina")).value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionSeleccion.filter( f => f.Name == _Opcion)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_method_analisys_Maquina")?.setValue("");
      return;
    }
    
  }

  this._RowMaquina = _Opcion;
}



MostrarSelec(Registro: IDataMachine): string {
  if(Registro == null) return "";
  return Registro.Name;
}

private _FiltroSeleccion(Name: string): IDataMachine[] {
  const filterValue = Name.toLowerCase();
  
  return this.optionSeleccion.filter(option => option.Name.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO COMPONENTE



  AgregarFila() : void
  {

    let Min = Math.min.apply(Math, this.dataSource_method_analisys.data.map(function(o) { return o.IdMethodAnalysis; }))
    
    if(this.dataSource_method_analisys.data.length > 0){
      Min -= 1
    }
    else
    {
      Min = -1
    }

 
    let Fila : IMethodAnalysis = {} as IMethodAnalysis;
    Fila.IdMethodAnalysis = Min;
    Fila.Codigo1 = "";
    Fila.Codigo2 = "";
    Fila.Codigo3 = "";
    Fila.Codigo4  = "";
    Fila.Descripcion = "";
    Fila.Freq = 1;
    Fila.Tmus = 0;
    Fila.Sec = 0;
    Fila.Sam = 0;

    this.dataSource_method_analisys.data.push(Fila);
    let cloned = this.dataSource_method_analisys.data.slice()
    this.dataSource_method_analisys.data = cloned;
    this.dataSource_method_analisys.filter = "";

    this.dataSource_method_analisys.paginator?.lastPage();

    

  }

  onKeyEnter(event : any, element : IMethodAnalysis, columna : string) : void
  {
    let _value : string = event.target.value;

    if(_value == undefined) return

    let Codigo1 : string = element.Codigo1;
    let Codigo2 : string = element.Codigo2;
    let Codigo3 : string = element.Codigo3;
    let Codigo4 : string = element.Codigo4;
    let Freq : Number = element.Freq;


    if(columna == "Codigo1") Codigo1 = _value;
    if(columna == "Codigo2") Codigo2 = _value;
    if(columna == "Codigo3") Codigo3 = _value;
    if(columna == "Codigo4") Codigo4 = _value;
    if(columna == "Freq") Freq = Number(_value);
 
    if(Codigo1 == "")
    {
      element.Tmus = 0;
      element.Sec = 0;
      element.Sam = 0;
      return;
    }


    if(Codigo1 == "S")
    {


      this._OperacionesService.GetSewing(Codigo3).subscribe(s =>{
        let _json = JSON.parse(s);
  
        if(_json["esError"] == 0)
        {

          element.Tmus = 0;
          if(_json["count"] > 0)
          {
            element.Tmus = this._RowMaquina.Rpm * (1.0/1667.0)
            element.Tmus =  ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[4].Valor / element.Tmus
            element.Tmus =  (element.Tmus * Number(_json["d"][0].Factor)) * Number(Codigo2);
            element.Tmus =  element.Tmus + (this._RowMaquina.Rpm / 1000.0) + (this._RowMaquina.Fatigue / 100.0);


            this._OperacionesService.GetSewing(Codigo3).subscribe( s2 =>{

              if(_json["esError"] == 0)
              {
                if(_json["count"] > 0)
                {
                  
                  element.Tmus =  element.Tmus + _json["d"][0].Factor;
                }
                
              }
              else
              {
                this.dialog.open(DialogoComponent, {
                  data : _json["msj"]
                })
              }


            });
    

            
          }


         
        }
        else
        {
          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
        }
  
      });


      
    }
    else
    {
      this._OperacionesService.GetCodigoGSD(Codigo1).subscribe(s =>{
        let _json = JSON.parse(s);
  
        if(_json["esError"] == 0)
        {

          element.Tmus = 0;
          if(_json["count"] > 0)
          {
            element.Tmus = Number(_json["d"][0].Tmus) * element.Freq;
            element.Sec = element.Tmus / (1667.0/60.0);
            element.Sam = element.Tmus / 1667.0;
          }


         
        }
        else
        {
          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
        }
  
      });
    }


  }


  cellChanged(element : IMethodAnalysis, columna : string) : void
   {
    let myTable : any = document.getElementById("tabla-method-analisys");

    let inputs = myTable.querySelectorAll('input')

    let index_Fila =  this.dataSource_method_analisys.data.findIndex(f => f.IdMethodAnalysis == element.IdMethodAnalysis);
    let index =  0;
    

    if(columna == "Codigo1") index = index + 1
    if(columna == "Codigo2") index = index + 2
    if(columna == "Codigo3") index = index + 3
    if(columna == "Codigo4") index = index + 4
    if(columna == "Descripcion") index = index + 5
    if(columna == "Freq") index = index + 6

    index = ((index_Fila + 1) * 6)  + (index - 6);

    
    if(inputs.length >= index + 1) inputs[index].focus();

   }


   clickRow(element : any) : void
   {

   }



 
  //#endregion EVENTOS TABLA 2

  


  ngOnInit(): void {
    this.Limpiar();
  }

}
