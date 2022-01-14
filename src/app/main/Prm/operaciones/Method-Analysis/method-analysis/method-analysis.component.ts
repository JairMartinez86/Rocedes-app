import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/main/Services/Usuario/login.service';

let ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS : IParametroMethodAnalysis[] = []


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

  public Open : boolean = false;
  public Link : string = "";

  displayedColumns_method_analisys: string[] = ["Index", "Parametro",   "Valor"];
  dataSource_parametro_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);

  constructor(private _LoginService : LoginService) {
   
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

    this.dataSource_parametro_method_analisys = new MatTableDataSource(ELEMENT_DATA_PARAMETROS_METHOD_ANALISIS);
   }
 
 
   Cerrar() :void
   {
     this.Limpiar();
     this.Link = "";
     this.Open = false;
   }
 

  ngOnInit(): void {
    this.Limpiar();
  }

}
