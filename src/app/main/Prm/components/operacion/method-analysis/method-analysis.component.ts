import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Validacion } from 'src/app/main/shared/class/Validacion/validacion';
import { ConfirmarContinuarComponent } from 'src/app/main/shared/dialogo/confirmar-continuar/confirmar-continuar.component';
import { ConfirmarEliminarComponent } from 'src/app/main/shared/dialogo/confirmar-eliminar/confirmar-eliminar.component';
import { DialogoComponent } from 'src/app/main/shared/dialogo/dialogo.component';
import { OperacionesService } from 'src/app/main/Prm/service/operaciones.service';
import { LoginService } from 'src/app/main/sis/service/login.service';


import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { ImagenLogo } from 'src/app/main/shared/Base64/logo';
import { IProducto } from 'src/app/main/shared/class/Form/Inv/Interface/i-Producto';
import { ProductoService } from 'src/app/main/inv/service/producto.service';
import { IDetMethodAnalysis } from '../../../interface/IDetMethod-Analysis';
import { IMethodAnalysis } from '../../../interface/i-Method-Analysis';
import { IDataMachine } from '../../../interface/i-data-machine';
import { ITela } from '../../../interface/i-Tela';
import { IMethodAnalysisData } from '../../../interface/i-MethodAnalysisData';


let ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS : IParametroMethodAnalysis[] = []
let ELEMENT_DATA_METHOD_ANALISIS : IDetMethodAnalysis[] = []





export interface IParametroMethodAnalysis {
  Index : number;
  Requerido : string;
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
  public Cargando : boolean = false;
  public Editar : boolean = false;
  private IdMethodAnalysis : number = -1;
  public str_Codigo : string = "";

  private _RowMaquina !: IDataMachine;
  private _RowTela !: ITela;
  private _RowProducto !: IProducto;
  private Fila_MethodAnalysis : IMethodAnalysis = {} as IMethodAnalysis;

  displayedColumns_parametros_method_analisys: string[] = ["Requerido", "Index", "Parametro",   "Valor"];
  dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);


  displayedColumns_method_analisys: string[] = ["IdDetMethodAnalysis", "Codigo1", "Codigo2", "Codigo3", "Codigo4", "Descripcion", "Freq", "Tmus", "Sec", "Sam", "Eliminar"];
  dataSource_method_analisys = new MatTableDataSource(ELEMENT_DATA_METHOD_ANALISIS);
  clickedRows = new Set<IDetMethodAnalysis>();

  constructor(private _LoginService : LoginService, public _OperacionesService : OperacionesService, private _ProductoService : ProductoService, private dialog : MatDialog) {
   
    this.val.add("txt_method_analisys_parametro1", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_manufactura", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_producto", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_parametro4", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_Maquina", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_parametro6", "1", "NUM>", "0");
    this.val.add("txt_method_analisys_parametro7", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro8", "1", "NUM>", "0");
    this.val.add("txt_method_analisys_parametro9", "1", "NUM>", "0");
    this.val.add("txt_method_analisys_Tela", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_parametro11", "1", "NUM>", "0");
    this.val.add("txt_method_analisys_parametro12", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro13", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro14", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro15", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro16", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro17", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro18", "1", "LEN>=", "0");
    this.val.add("txt_method_analisys_parametro19", "1", "LEN>", "0");
    this.val.add("txt_method_analisys_parametro20", "1", "LEN>", "0");
    this.Limpiar();
   }

   

   Limpiar(): void
   {

    this.Editar = false;

    if(this.Cargando) return;
    this.str_Codigo = "";
    this.IdMethodAnalysis = -1;
    document.getElementById("from-method-analisys")?.classList.add("disabled");
    this.dataSource_method_analisys.data.splice(0, this.dataSource_method_analisys.data.length);
    this.dataSource_parametros_method_analisys.data.splice(0, this.dataSource_parametros_method_analisys.data.length);
    ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS.splice(0, ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS.length);
    this.dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);
    this.val.ValForm.get("txt_method_analisys_parametro1")?.disable();
   }
 

  

 
  //#region EVENTOS TABLA 2
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource_method_analisys.filter = filtro.trim().toLowerCase();
  }  



  
  //#region AUTO COMPLETADO MAQUINA
	
  optionSeleccion : IDataMachine[] = [];
  filteredOptions!: Observable<IDataMachine[]>;

  txt_method_analisys_Maquina_onSearchChange(event : any) :void{

  this.optionSeleccion.splice(0, this.optionSeleccion.length);

  let value : string = event.target.value;

 
  if(value.length <= 2) return;


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
      this.val.ValForm.get("txt_method_analisys_Maquina")?.setValue(undefined);
      return;
    }
    
  }

  this._RowMaquina = _Opcion;
  ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[4].Valor = _Opcion.Name;

}

txt_method_analisys_Maquina_onSelectionChange(_Opcion: IDataMachine) :void
{
  this._RowMaquina = _Opcion;
  ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[4].Valor = _Opcion.Name;
}



MostrarSelec(Registro: IDataMachine): string {
  if(Registro == null) return "";
  return Registro.Name;
}

private _FiltroSeleccion(Name: string): IDataMachine[] {
  const filterValue = Name.toLowerCase();
  
  return this.optionSeleccion.filter(option => option.Name.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO MAQUINA





  
  //#region AUTO COMPLETADO PRODUCTO
	
  optionSeleccionProducto : IProducto[] = [];
  filteredOptionsProducto!: Observable<IProducto[]>;

  txt_method_analisys_producto_onSearchChange(event : any) :void{

    this.optionSeleccionProducto.splice(0, this.optionSeleccionProducto.length);

    let value : string = event.target.value;


    if(value.length <= 2) return;


    this._ProductoService.GetAuto(value).subscribe( s => {
      let _json = JSON.parse(s);


      if(_json["esError"] == 0){


        if(_json["count"] > 0){
          
          _json["d"].forEach((j : IProducto) => {
            this.optionSeleccionProducto.push(j);
          });

          this.filteredOptionsProducto = this.val.ValForm.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : value.Nombre)),
            map(Nombre => (Nombre ? this._FiltroSeleccionProducto(Nombre) : this.optionSeleccionProducto.slice())),
          );
        
        }
      
      }else{
        this.dialog.open(DialogoComponent, {
          data: _json["msj"]
        })



      }

    });


}


txt_method_analisys_producto_onFocusOutEvent(event: any) :void
{
  let _Opcion : any = (<HTMLInputElement>document.getElementById("txt_method_analisys_producto")).value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionSeleccionProducto.filter( f => f.Nombre == _Opcion)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_method_analisys_producto")?.setValue(undefined);
      return;
    }
    
  }

  this._RowMaquina = _Opcion;
  ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[2].Valor = _Opcion.Nombre;
}


txt_method_analisys_producto_onSelectionChange(_Opcion: IProducto) :void
{
  this._RowProducto = _Opcion;
  ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[2].Valor = _Opcion.Nombre;
}



MostrarSelecProducto(Registro: IProducto): string {
  if(Registro == null) return "";
  return Registro.Nombre;
}

private _FiltroSeleccionProducto(Nombre: string): IProducto[] {
  const filterValue = Nombre.toLowerCase();
  
  return this.optionSeleccionProducto.filter(option => option.Nombre.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO PRODUCTO



  //#region AUTO COMPLETADO TELA
	
  optionSeleccionTela : ITela[] = [];
  filteredOptionsTela!: Observable<ITela[]>;

  txt_method_analisys_Tela_onSearchChange(event : any) :void{

  
  let value : string = event.target.value;

  this.optionSeleccionTela.splice(0, this.optionSeleccionTela.length);

  if(value.length <= 2) return;

  this._OperacionesService.GetTelaAuto(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((j : ITela) => {
          this.optionSeleccionTela.push(j);
        });

        this.filteredOptionsTela = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Nombre)),
          map(Nombre => (Nombre ? this._FiltroSeleccionTela(Nombre) : this.optionSeleccionTela.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });


}

txt_method_analisys_Tela_onFocusOutEvent(event: any) :void
{

  let _Opcion : any = (<HTMLInputElement>document.getElementById("txt_method_analisys_Tela")).value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionSeleccionTela.filter( f => f.Nombre == _Opcion)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_method_analisys_Tela")?.setValue(undefined);
      return;
    }
    
  }
  
  this._RowTela = _Opcion;
}

txt_method_analisys_Tela_onSelectionChange(_Opcion: ITela) :void
{
  this._RowTela = _Opcion;
}


MostrarSelecTela(Registro: ITela): string {
  if(Registro == null) return "";
  return Registro.Nombre;
}

private _FiltroSeleccionTela(Nombre: string): ITela[] {
  const filterValue = Nombre.toLowerCase();
  
  return this.optionSeleccionTela.filter(option => option.Nombre.toLowerCase().startsWith(filterValue));
}



cellChanged_Param(event : any, index : number) : void
{
 let myTable : any = document.getElementById("tabla-parametros-method-analisys");

 let inputs = myTable.querySelectorAll('input')
 

 if(event.keyCode == 13 || event.keyCode == 40) // ENTER Y ABAJO
 {
  if(inputs.length >= index + 1) inputs[index-1].focus();
 }


if(event.keyCode == 38) // Arriba
{
  if(inputs.length >= index - 3) inputs[index-3].focus();
}

   

}


//#endregion AUTO COMPLETADO TELA







txt_method_analisys_onSearchChange(event : any) :void{

  this.dataSource_method_analisys.data.forEach(element => {
    this.onKeyEnter(event, element, "");
  });
}

  AgregarFila() : void
  {

    let Min = Math.min.apply(Math, this.dataSource_method_analisys.data.map(function(o) { return o.IdDetMethodAnalysis; }))
    
    if(this.dataSource_method_analisys.data.length > 0){
      Min -= 1;
      if(Min >= 0 ) Min = -1;
    }
    else
    {
      Min = -1
    }

 
    let Fila : IDetMethodAnalysis = {} as IDetMethodAnalysis;
    Fila.IdDetMethodAnalysis = Min;
    Fila.IdMethodAnalysis = this.IdMethodAnalysis;
    Fila.Codigo1 = "";
    Fila.Codigo2 = "";
    Fila.Codigo3 = "";
    Fila.Codigo4  = "";
    Fila.Descripcion = "";
    Fila.Freq = 1;
    Fila.Tmus = 0;
    Fila.Sec = 0;
    Fila.Sam = 0;
    Fila.EsTotal = false;

    this.dataSource_method_analisys.data.push(Fila);

    this.AgregarTotal();

  }

  onKeyEnter(event : any, element : IDetMethodAnalysis, columna : string) : void
  {

  
    let index = this.dataSource_method_analisys.data.findIndex(f => f.EsTotal)

    if(index > 0) this.dataSource_method_analisys.data.splice(index, 1);


    element.Tmus = 0;
    element.Sec = 0;
    element.Sam = 0;

    if(event == null) return;


    let _value : string = event.target.value;

    if(_value == undefined) return;
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
 
   
    if(Codigo1 == "") return;



    if(Codigo1 === "S")
    {


      this._OperacionesService.GetSewing(Codigo3).subscribe(s =>{
        let _json = JSON.parse(s);
  
        if(_json["esError"] == 0)
        {

          element.Tmus = 0;
          if(_json["count"] > 0)
          {
            element.Tmus = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[5].Valor / (this._RowMaquina.Rpm * (1.0/1667.0));
            element.Tmus =  (element.Tmus * Number(_json["d"][0].Factor)) * Number(Codigo2);
            element.Tmus =  element.Tmus + (this._RowMaquina.Rpm / 1000.0) + 17;
           
            this.Fila_MethodAnalysis.FactorSewing = Number(_json["d"][0].Factor);

            this._OperacionesService.GetSewingAccuracy(Codigo3).subscribe( s2 =>{

              let _json = JSON.parse(s2);

              if(_json["esError"] == 0)
              {
                if(_json["count"] > 0)
                {
                  element.Tmus =  element.Tmus + Number(_json["d"][0].Factor);
                  this.Fila_MethodAnalysis.FactorSewingAccuracy = Number( _json["d"][0].Factor);
                }

                
                element.Tmus =  element.Tmus * element.Freq;
                element.Sec = element.Tmus / (1667.0/60.0);
                element.Sam = element.Tmus / 1667.0;

                this.AgregarTotal();
              }
              else
              {
                this.AgregarTotal()
                this.dialog.open(DialogoComponent, {
                  data : _json["msj"]
                })
              }


            });
    

            
          }


         
        }
        else
        {
          this.AgregarTotal();
          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
        }
  
      });


      
    }
    else
    {
      Codigo2 = "";
      Codigo3 = "";
      Codigo4 = "";
      element.Codigo2 = "";
      element.Codigo3 = "";
      element.Codigo4 = "";
      if(columna == "Codigo2") event.target.value = "";
      if(columna == "Codigo3") event.target.value = "";
      if(columna == "Codigo4") event.target.value = "";

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
            this.AgregarTotal();
          }


         
        }
        else
        {
          element.Tmus = 0;
          element.Sec = 0;
          element.Sam = 0;
          this.AgregarTotal();
          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
        }
  
      });
    }


  }

  AgregarTotal() : void
  {
    let index = this.dataSource_method_analisys.data.findIndex(f => f.EsTotal)

    if(index >= 0) this.dataSource_method_analisys.data.splice(index, 1);



    let Min = Math.min.apply(Math, this.dataSource_method_analisys.data.map(function(o) { return o.IdDetMethodAnalysis; }))
    
    if(this.dataSource_method_analisys.data.length > 0){
      Min -= 1
    }
    else
    {
      Min = -1
    }

    let RegistroTotal: IDetMethodAnalysis = {} as IDetMethodAnalysis;

    RegistroTotal.IdDetMethodAnalysis = Min;
    RegistroTotal.EsTotal = true;
    RegistroTotal.Descripcion = "TOTAL";
    RegistroTotal.Tmus = this.dataSource_method_analisys.data.reduce((Tmus, cur) => Tmus + cur.Tmus, 0);
    RegistroTotal.Sec = this.dataSource_method_analisys.data.reduce((Sec, cur) => Sec + cur.Sec, 0);
    RegistroTotal.Sam = this.dataSource_method_analisys.data.reduce((Sam, cur) => Sam + cur.Sam, 0);
    this.dataSource_method_analisys.data.push(RegistroTotal);
   
    let cloned = this.dataSource_method_analisys.data.slice()
    this.dataSource_method_analisys.data = cloned;

    this.dataSource_method_analisys.paginator?.lastPage();

  }

  cellChanged(event : any,element : IDetMethodAnalysis, columna : string,) : void
   {
    let myTable : any = document.getElementById("tabla-method-analisys");

    let inputs = myTable.querySelectorAll('input')

    let index_Fila =  this.dataSource_method_analisys.data.findIndex(f => f.IdDetMethodAnalysis == element.IdDetMethodAnalysis);
    let index =  0;

    if(columna == "Codigo1") index = 1
    if(columna == "Codigo2") index =  2
    if(columna == "Codigo3") index = 3
    if(columna == "Codigo4") index =  4
    if(columna == "Descripcion") index =  5
    if(columna == "Freq") index =  6


    if(event.keyCode == 13 || event.keyCode == 39) // ENTER Y DERECHA
    {
      index = ((index_Fila + 1) * 6)  + (index - 6);

      if(inputs.length >= index + 1) inputs[index].focus();
  
    }

    if(event.keyCode == 37) // Izquierda
    {

      if(index_Fila > 0)
      {
        index = ((index_Fila - 1) * 6)  + ((index + 6) - 2);
      }
      else
      {
        index -= 2;
      }

      if(inputs.length >= index) inputs[index].focus();
  
    }
    

    if(event.keyCode == 38) // Arriba
    {
      index -= 1;
      if((index_Fila - 1) > 0) index = (index_Fila * 6) + (index - 6);
      if(inputs.length >= index) inputs[index].focus();
    }
    //7
    
    if(event.keyCode == 40) // Abajo
    {
      index -= 1;
      index = index +  ((index_Fila + 1) * 6);
      if(inputs.length >= index) inputs[index].focus();
    }
    
   

   }


   clickRow(element : IDetMethodAnalysis) : void
   {

    let index : number = 0;
    if(element.IdDetMethodAnalysis < 0 )
    {
      index  = this.dataSource_method_analisys.data.findIndex(f =>  Number(f.IdDetMethodAnalysis) == element.IdDetMethodAnalysis);
      if(index >= 0) this.dataSource_method_analisys.data.splice(index, 1);
      this.AgregarTotal();
      return;
    }

    let _dialog = this.dialog.open(ConfirmarEliminarComponent)
    document.getElementById("body")?.classList.add("disabled");

    _dialog.afterClosed().subscribe( s =>{
      document?.getElementById("body")?.classList.remove("disabled");
      if(_dialog.componentInstance.Retorno == "1")
      {
        this._OperacionesService.EliminarMethodAnalysis(element.IdDetMethodAnalysis, this._LoginService.str_user).subscribe( s =>{
  
          let _json = JSON.parse(s);
                
          if(_json["esError"] == 0)
          {
            index  = this.dataSource_method_analisys.data.findIndex(f =>  Number(f.IdDetMethodAnalysis) == Number(_json["d"].IdDetMethodAnalysis));
    
    
            if(index >= 0) this.dataSource_method_analisys.data.splice(index, 1);
          }
         
          
          this.AgregarTotal();

          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
      
        });
      }
    });
   }



 
  //#endregion EVENTOS TABLA 2

  

  Nuevo() : void
  {

    this.Editar = true;

    this.val.ValForm.reset();
    this.val.ValForm.get("txt_method_analisys_parametro1")?.setValue(this._LoginService.str_user);
    this.val.ValForm.get("txt_method_analisys_parametro1")?.disable();
    document.getElementById("from-method-analisys")?.classList.remove("disabled");
    
    

    ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS = [
      {Index : 1, Requerido : "*", Parametro : "ANALISTA", Valor : this._LoginService.str_user},
      {Index : 2, Requerido : "*", Parametro : "PROCESO DE MANUFACTURA", Valor : ""},
      {Index : 3, Requerido : "*", Parametro : "TIPO DE PRODUCTO", Valor : ""},
      {Index : 4, Requerido : "*", Parametro : "NOMBRE DE LA OPERACION", Valor : ""},
      {Index : 5, Requerido : "*", Parametro : "TIPO DE MAQUINA", Valor : ""},
      {Index : 6, Requerido : "*", Parametro : "PUNTADAS POR PUGADAS", Valor : 0},
      {Index : 7, Requerido : "", Parametro : "MANEJO DE PAQUETE", Valor : ""},
      {Index : 8, Requerido : "*", Parametro : "RATE C$", Valor : 0},
      {Index : 9, Requerido : "*", Parametro : "JORNADA LABORAL", Valor : 0},
      {Index : 10, Requerido : "*", Parametro : "TIPO DE TELA", Valor : ""},
      {Index : 11, Requerido : "*", Parametro : "ONZAJE DE TELA", Valor : 0},
      {Index : 12, Requerido : "", Parametro : "MATERIA PRIMA 1", Valor : ""},
      {Index : 13, Requerido : "", Parametro : "MATERIA PRIMA 2", Valor : ""},
      {Index : 14, Requerido : "", Parametro : "MATERIA PRIMA 3", Valor : ""},
      {Index : 15, Requerido : "", Parametro : "MATERIA PRIMA 4", Valor : ""},
      {Index : 16, Requerido : "", Parametro : "MATERIA PRIMA 5", Valor : ""},
      {Index : 17, Requerido : "", Parametro : "MATERIA PRIMA 6", Valor : ""},
      {Index : 18, Requerido : "", Parametro : "MATERIA PRIMA 7", Valor : ""},
      {Index : 19, Requerido : "*", Parametro : "FAMILIA", Valor : ""},
      {Index : 20, Requerido : "*", Parametro : "TIPO DE CONSTRUCCION", Valor : ""}
    ];

    this.dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);

    this.dataSource_method_analisys.data.splice(0, this.dataSource_method_analisys.data.length);

    let cloned = this.dataSource_method_analisys.data.slice()
    this.dataSource_method_analisys.data = cloned;

    this.dataSource_method_analisys.paginator?.lastPage();
    
  }

  CarpturarDatos() : void
  {

    this.Fila_MethodAnalysis.Codigo = this.str_Codigo;
    this.Fila_MethodAnalysis.ProcesoManufact = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[1].Valor;
    this.Fila_MethodAnalysis.IdProducto = this._RowProducto.IdProducto;
    this.Fila_MethodAnalysis.TipoProducto = this._RowProducto.Nombre;
    this.Fila_MethodAnalysis.Operacion = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[3].Valor;
    this.Fila_MethodAnalysis.IdDataMachine = this._RowMaquina.IdDataMachine;
    this.Fila_MethodAnalysis.DataMachine = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[4].Valor;
    this.Fila_MethodAnalysis.Puntadas = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[5].Valor;
    this.Fila_MethodAnalysis.ManejoPaquete = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[6].Valor;
    this.Fila_MethodAnalysis.Rate = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[7].Valor;
    this.Fila_MethodAnalysis.JornadaLaboral = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[8].Valor;
    this.Fila_MethodAnalysis.IdTela = this._RowTela.IdTela;
    this.Fila_MethodAnalysis.Onza = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[10].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_1 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[11].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_2 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[12].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_3 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[13].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_4 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[14].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_5 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[15].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_6 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[16].Valor;
    this.Fila_MethodAnalysis.MateriaPrima_7 = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[17].Valor;
    this.Fila_MethodAnalysis.Familia = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[18].Valor;
    this.Fila_MethodAnalysis.TipoConstruccion = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[19].Valor;
    this.Fila_MethodAnalysis.Usuario = ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[0].Valor;
    this.Fila_MethodAnalysis.IdMethodAnalysis = this.IdMethodAnalysis;
    this.Fila_MethodAnalysis.Stitch = this._RowMaquina.Stitch;
    this.Fila_MethodAnalysis.Rpm = this._RowMaquina.Rpm;
    this.Fila_MethodAnalysis.Delay = this._RowMaquina.Delay;
    this.Fila_MethodAnalysis.Personal = this._RowMaquina.Personal;
    this.Fila_MethodAnalysis.Fatigue = this._RowMaquina.Fatigue;
    this.Fila_MethodAnalysis.Sewing = this.dataSource_method_analisys.data.filter(item => !isNaN(Number(item.Codigo2))).reduce((sum, current) => sum + Number(current.Codigo2), 0);
    this.Fila_MethodAnalysis.Tmus_Mac = this.dataSource_method_analisys.data.filter(item => item.Codigo1 == "S" && !item.EsTotal ).reduce((sum, current) => sum + current.Tmus, 0);
    this.Fila_MethodAnalysis.Tmus_MinL = this.dataSource_method_analisys.data.filter(item => item.Codigo1 != "S" && !item.EsTotal ).reduce((sum, current) => sum + current.Tmus, 0);
    this.Fila_MethodAnalysis.Min_Mac = this.Fila_MethodAnalysis.Tmus_Mac / 1667.00;
    this.Fila_MethodAnalysis.Min_NML = this.Fila_MethodAnalysis.Tmus_MinL / 1667.00;
    this.Fila_MethodAnalysis.Min_Mac_CC = this.Fila_MethodAnalysis.Min_Mac + this.Fila_MethodAnalysis.Min_NML;
    this.Fila_MethodAnalysis.Min_NML_CC = (this.Fila_MethodAnalysis.Min_Mac *  (this._RowMaquina.Delay / 100.0)) + (this.Fila_MethodAnalysis.Min_Mac_CC * ((this._RowMaquina.Personal + this._RowMaquina.Fatigue)  / 100.0));
    this.Fila_MethodAnalysis.Sam = this.Fila_MethodAnalysis.Min_Mac_CC + this.Fila_MethodAnalysis.Min_NML_CC;
    this.Fila_MethodAnalysis.ProducJL = Number((this.Fila_MethodAnalysis.JornadaLaboral / this.Fila_MethodAnalysis.Sam).toFixed(2));
    this.Fila_MethodAnalysis.Precio = this.Fila_MethodAnalysis.Rate / this.Fila_MethodAnalysis.ProducJL;

  }
  Guardar() : void
  {

    let _dialog = this.dialog.open(ConfirmarContinuarComponent)
    document.getElementById("body")?.classList.add("disabled");

    _dialog.afterClosed().subscribe( s =>{
      document?.getElementById("body")?.classList.remove("disabled");
      if(_dialog.componentInstance.Retorno == "1")
      {

        this.CarpturarDatos();
       
        let datos : IMethodAnalysisData  = {} as IMethodAnalysisData;
        datos.d = this.Fila_MethodAnalysis;
        datos.d2 = this.dataSource_method_analisys.data.filter(f => !f.EsTotal && (f.Codigo1 + f.Codigo2 + f.Codigo3 + f.Codigo4).trimEnd().length > 0 );


        if(datos.d2.length == 0 )
        {
          this.dialog.open(DialogoComponent, {
            data : "Por favor verifique si las celdas no se encuentren vacias."
          })
          return;
        }

        this._OperacionesService.GuardarMethodAnalysis(datos).subscribe(s =>{

          let _json = JSON.parse(s);
    
          if(_json["esError"] == 0)
          {
    
            if(_json["count"]  > 0)
            {
              this.dataSource_method_analisys.data.splice(0, this.dataSource_method_analisys.data.length);
              
              this.IdMethodAnalysis = Number(_json["d"][0].IdMethodAnalysis);
              this.str_Codigo = String(Number(_json["d"][0].Codigo));

              _json["d"][1].forEach((d : IDetMethodAnalysis )  => {
                this.dataSource_method_analisys.data.push(d);
              });
            }
            this.AgregarTotal();
    
            this.dialog.open(DialogoComponent, {
              data : _json["msj"]
            })

          }
          else
          {
            this.dialog.open(DialogoComponent, {
              data : _json["msj"]
            })
          }
    
        });
      }
    });
  }

  Merge(col : string, Texto : string, isbold : boolean, Alignment : string,  Size : number, Color : string, ColorFill : string, worksheet : Worksheet) : void
  {
    worksheet.mergeCells(col);
    let Fila = worksheet.getCell(col);
    Fila.value = Texto;
    if(Alignment == "middle:center") Fila.alignment = {  vertical: 'middle', horizontal: 'center'};
    if(Alignment == "middle:right") Fila.alignment = {  vertical: 'middle', horizontal: 'right'};
    if(Alignment == "right") Fila.alignment = {  horizontal: 'right'};
    Fila.font = {
      name: 'Calibri',
      family: 2,
      size: Size,
      underline: false,
      italic: false,
      bold: isbold,
      color: { argb: Color }
    };

    if(ColorFill != "")
    {
      Fila.fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb: ColorFill},
      };
    }

  }
  

  Exportar() : void
  {

    this.CarpturarDatos();

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet("FILE");

    var Imagen = (new ImagenLogo()).Logo();

    let headerImage = workbook.addImage({
      base64: Imagen,
      extension: 'png',
    });
    worksheet.addImage( headerImage, {
      tl: { col: 0.2, row: 0.2 },
      ext: { width: 96.88, height: 52.85 }
    });
    

    let dobCol = worksheet.getColumn(6);
    dobCol.width = 14;
    dobCol = worksheet.getColumn(7);
    dobCol.width = 14;
    dobCol = worksheet.getColumn(8);
    dobCol.width = 14;
    dobCol = worksheet.getColumn(9);
    dobCol.width = 14;


    this.Merge("A1:B3", "", false, "middle:center", 11, "FFFFFF", "1C394F", worksheet);
    this.Merge("C1:M3", "METHOD ANALYSIS", true, "middle:center", 20, "FFFFFF", "1C394F", worksheet);




    this.Merge("B5:E5", "OPERACION :", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F5:I5", "", false,"middle:center", 11, "#000000", "", worksheet);
    let Fila = worksheet.getCell("F5");
    Fila.value = this.Fila_MethodAnalysis.Operacion;
    this.Merge("J5:L5", "STITCH TYPE :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M5");
    Fila.value = Number(this.Fila_MethodAnalysis.Stitch);
    Fila.numFmt = '#,##0;[Red]-$#,##0'


    this.Merge("B6:E6", "", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F6:I6", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J6:L6", "SPI/SPO :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M6");
    Fila.value = Number(this.Fila_MethodAnalysis.Puntadas);
    Fila.numFmt = '#,##0.00;[Red]-$#,##0.00'

    this.Merge("B7:E7", "MAQUINA :", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F7:I7", "", false,"middle:center", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F7");
    Fila.value = this.Fila_MethodAnalysis.DataMachine;
    this.Merge("J7:L7", "RPM :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M7");
    Fila.value = this.Fila_MethodAnalysis.Rpm;
    Fila.numFmt = '#,##0;[Red]-$#,##0'


    this.Merge("B8:E8", "RATE C$ :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F8");
    Fila.value = Number(this.Fila_MethodAnalysis.Rate);
    Fila.numFmt = '#,##0.00;[Red]-$#,##0.00'
    this.Merge("G8:I8", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J8:L8", "", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M8");
    Fila.value = "";


    this.Merge("B9:E9", "PRECIO :", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F9", "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("F9");
    Fila.value = this.Fila_MethodAnalysis.Precio;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("G9:I9", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J9:L9", "", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M9");
    Fila.value = "";

    this.Merge("B10:E10", "TMU'S/MAC. :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F10");
    Fila.value = this.Fila_MethodAnalysis.Tmus_Mac;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("G10", "MIN/MAC", false,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("H10");
    Fila.value = this.Fila_MethodAnalysis.Min_Mac;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    Fila = worksheet.getCell("I10");
    Fila.value = (this.Fila_MethodAnalysis.Min_Mac *  (this._RowMaquina.Delay / 100.0));
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("J10:L10", "", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M10");
    Fila.value = "";

    this.Merge("B11:E11", "TMU'S/MNL :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F11");
    Fila.value = this.Fila_MethodAnalysis.Tmus_MinL;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("G11", "MIN/MNL", false,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("H11");
    Fila.value = this.Fila_MethodAnalysis.Min_NML;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    Fila = worksheet.getCell("I11");
    Fila.value =  (this.Fila_MethodAnalysis.Min_Mac_CC * ((this._RowMaquina.Personal + this._RowMaquina.Fatigue)  / 100.0));
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("J11:L11", "", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M11");
    Fila.value = "";


    this.Merge("B12:E12", "SAM/C :", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F12", "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("F12");
    Fila.value = this.Fila_MethodAnalysis.Sam;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("G12", "C.C :", false,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("H12");
    Fila.value = this.Fila_MethodAnalysis.Min_Mac_CC;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    Fila = worksheet.getCell("I12");
    Fila.value = this.Fila_MethodAnalysis.Min_NML_CC;
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'
    this.Merge("J12:L12", "", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M12");
    Fila.value = "";


    this.Merge("B13:E13", "PRODUCCION/J.L :", true,"right", 11, "#000000", "", worksheet);
    this.Merge("F13", "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("F13");
    Fila.value = this.Fila_MethodAnalysis.ProducJL;
    Fila.numFmt = '#,##0.00;[Red]-$#,##0.00'
    this.Merge("G13:I13", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J13:L13", "TOL MAQUINA %: ", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M13");
    Fila.value = (this.Fila_MethodAnalysis.Delay / 100.0);
    Fila.numFmt = '#,##0.00 %;[Red]-$#,##0.00 %'


    this.Merge("B14:E14", "COSTURA :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F14");
    Fila.value = this.Fila_MethodAnalysis.Sewing;
    Fila.numFmt = '#,##0.00;[Red]-$#,##0.00'
    this.Merge("G14:I14", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J14:L14", "PERSONAL % :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M14");
    Fila.value = (this.Fila_MethodAnalysis.Personal / 100.0);
    Fila.numFmt = '#,##0.00 %;[Red]-$#,##0.00 %'

    this.Merge("B15:E15", "JORNADA LABORAL :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("F15");
    Fila.value = Number(this.Fila_MethodAnalysis.JornadaLaboral);
    Fila.numFmt = '#,##0.00;[Red]-$#,##0.00'
    this.Merge("G15:I15", "", false,"middle:center", 11, "#000000", "", worksheet);
    this.Merge("J15:L15", "FATIGA %  :", true,"right", 11, "#000000", "", worksheet);
    Fila = worksheet.getCell("M15");
    Fila.value = (this.Fila_MethodAnalysis.Fatigue / 100.0);
    Fila.numFmt = '#,##0.00 %;[Red]-$#,##0.00 %'

    this.Merge("A16", "", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
    this.Merge("B16:E16", "CODIGOS", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
    this.Merge("F16:I16", "DESCRIPCION DE ELEMENTOS", true,"middle:center", 16, "FFFFFF", "1C394F", worksheet);
    this.Merge("J16", "FREQ.", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
    this.Merge("K16", "TMU's", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
    this.Merge("L16", "SEC.", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
    this.Merge("M16", "SAM", true,"middle:center", 13, "FFFFFF", "1C394F", worksheet);
  

    let index : number = 16;
    for (let i = 0; i < this.dataSource_method_analisys.data.filter(f => !f.EsTotal).length; i++)
    {
    
      let x2  = Object.values(this.dataSource_method_analisys.data[i]);
      let temp=[];
      for(let y = 2; y < x2.length - 1; y++)
      {

        if( y < 11)
        {
          if( y == 2) temp.push("");
       
          if( y == 7) 
          {
            temp.push(x2[y]);
            temp.push("");
            temp.push("");
            temp.push("");
          }
          else
          {
            if( y == 3 && !isNaN(Number(x2[y])))
            {
               if(x2[y] != "")
               {
                temp.push(Number(x2[y]));
               }
               else
               {
                temp.push(x2[y]);
               }
               
            }
            else
            {
              temp.push(x2[y]);
            }
           
          }
        }
        
        
      }

      
      worksheet.addRow(temp);
      index++;
      worksheet.mergeCells("F" + index + ":I" + index);
    }

    index++;

    this.Merge("A" + index + ":J" + index, "TOTALS ", true,"right", 11, "#000000", "", worksheet);

    this.Merge("K"+ index, "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("K"+ index);
    Fila.value = this.dataSource_method_analisys.data.filter(item =>!item.EsTotal ).reduce((sum, current) => sum + current.Tmus, 0);
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'

    this.Merge("L"+ index, "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("L"+ index);
    Fila.value = this.dataSource_method_analisys.data.filter(item => !item.EsTotal ).reduce((sum, current) => sum + current.Sec, 0);
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'

    this.Merge("M"+ index, "", true,"right", 11, "FFFFFF", "1C394F", worksheet);
    Fila = worksheet.getCell("M"+ index);
    Fila.value = this.dataSource_method_analisys.data.filter(item => !item.EsTotal ).reduce((sum, current) => sum + current.Sec, 0);
    Fila.numFmt = '#,##0.0000;[Red]-$#,##0.0000'


    let fname="methos-analysis";

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });


  }

  ngAfterViewInit(): void
  {

    this.Limpiar();

    this._OperacionesService.change.subscribe(s => {

      if(s[0] == "Open")
      {
        this.Nuevo();
        this.Cargando = true;
        this.Limpiar();
        this.Editar = true;
        document.getElementById("from-method-analisys")?.classList.remove("disabled");
        let Datos : any = s[1];

        this._RowMaquina = {} as IDataMachine;
        this._RowTela = {} as ITela;
        this._RowProducto = {} as IProducto;

   
  
        this.str_Codigo = Datos.Codigo;
        this.IdMethodAnalysis = Datos.IdMethodAnalysis;
        this._RowMaquina.IdDataMachine = Datos.IdDataMachine;
        this._RowMaquina.Name = Datos.DataMachine;
        this._RowMaquina.Stitch = Datos.Stitch;
        this._RowMaquina.Rpm = Datos.Rpm;
        this._RowMaquina.Delay = Datos.Delay;
        this._RowMaquina.Personal = Datos.Personal;
        this._RowMaquina.Fatigue = Datos.Fatigue;
        this._RowTela.IdTela = Datos.IdTela;
        this._RowTela.Nombre = Datos.Tela;
        this._RowProducto.Nombre = Datos.TipoProducto;
        this._RowProducto.IdProducto = Datos.IdProducto;

        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[0].Valor = Datos.Usuario;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[1].Valor = Datos.ProcesoManufact;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[2].Valor = Datos.TipoProducto;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[3].Valor = Datos.Operacion;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[4].Valor = Datos.DataMachine;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[5].Valor = Datos.Puntadas;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[6].Valor = Datos.ManejoPaquete;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[7].Valor = Datos.Rate;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[8].Valor = Datos.JornadaLaboral;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[10].Valor = Datos.Onza;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[11].Valor = Datos.MateriaPrima_1;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[12].Valor = Datos.MateriaPrima_2;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[13].Valor = Datos.MateriaPrima_3;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[14].Valor = Datos.MateriaPrima_4;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[15].Valor = Datos.MateriaPrima_5;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[16].Valor = Datos.MateriaPrima_6;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[17].Valor = Datos.MateriaPrima_7;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[18].Valor = Datos.Familia;
        ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS[19].Valor = Datos.TipoConstruccion;
        

        this.val.ValForm.get("txt_method_analisys_parametro1")?.setValue(Datos.Usuario);
        this.val.ValForm.get("txt_method_analisys_manufactura")?.setValue(Datos.ProcesoManufact);
        this.val.ValForm.get("txt_method_analisys_producto")?.setValue(this._RowProducto);
        this.val.ValForm.get("txt_method_analisys_parametro4")?.setValue(Datos.Operacion);
        this.val.ValForm.get("txt_method_analisys_Maquina")?.setValue(this._RowMaquina);
        this.val.ValForm.get("txt_method_analisys_parametro6")?.setValue(Datos.Puntadas);
        this.val.ValForm.get("txt_method_analisys_parametro7")?.setValue(Datos.ManejoPaquete);
        this.val.ValForm.get("txt_method_analisys_parametro8")?.setValue(Datos.Rate);
        this.val.ValForm.get("txt_method_analisys_parametro9")?.setValue(Datos.JornadaLaboral);
        this.val.ValForm.get("txt_method_analisys_Tela")?.setValue(this._RowTela);
        this.val.ValForm.get("txt_method_analisys_parametro11")?.setValue(Datos.Onza);
        this.val.ValForm.get("txt_method_analisys_parametro12")?.setValue(Datos.MateriaPrima_1);
        this.val.ValForm.get("txt_method_analisys_parametro13")?.setValue(Datos.MateriaPrima_2);
        this.val.ValForm.get("txt_method_analisys_parametro14")?.setValue(Datos.MateriaPrima_3);
        this.val.ValForm.get("txt_method_analisys_parametro15")?.setValue(Datos.MateriaPrima_4);
        this.val.ValForm.get("txt_method_analisys_parametro16")?.setValue(Datos.MateriaPrima_5);
        this.val.ValForm.get("txt_method_analisys_parametro17")?.setValue(Datos.MateriaPrima_6);
        this.val.ValForm.get("txt_method_analisys_parametro18")?.setValue(Datos.MateriaPrima_7);
        this.val.ValForm.get("txt_method_analisys_parametro19")?.setValue(Datos.Familia);
        this.val.ValForm.get("txt_method_analisys_parametro20")?.setValue(Datos.TipoConstruccion);
       
        this.dataSource_parametros_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);
        this.dataSource_method_analisys.data.splice(0, this.dataSource_method_analisys.data.length);

        this._OperacionesService.GetDetMethodAnalysis(this.IdMethodAnalysis).subscribe(s =>{
          let _json = JSON.parse(s);
    
          if(_json["esError"] == 0)
          {
            _json["d"].forEach((d : IDetMethodAnalysis) => {
              this.dataSource_method_analisys.data.push(d);
            });
    
           this.AgregarTotal();

            this.Open = true;
            this.Cargando = false;
    
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
        this.Cargando = false;
        this.Limpiar();
        this.Open = false;
        this.Link = "";
      }

      
      
    });
  }

  ngOnInit(): void {}

}
