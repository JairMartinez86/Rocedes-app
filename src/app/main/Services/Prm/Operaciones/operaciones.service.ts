import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { ICodigoGSD } from 'src/app/main/class/Form/PRM/i-Codigo-GSD';
import { IDataMachine } from 'src/app/main/class/Form/PRM/i-data-machine';
import { IMethodAnalysis } from 'src/app/main/class/Form/PRM/i-Method-Analysis';
import { IOunce } from 'src/app/main/class/Form/PRM/i-Ounce';
import { IPartes } from 'src/app/main/class/Form/PRM/i-Partes';
import { ISewing } from 'src/app/main/class/Form/PRM/i-Sewing';
import { ISewingAccuracy } from 'src/app/main/class/Form/PRM/i-SewingAccuracy';
import { ITela } from 'src/app/main/class/Form/PRM/i-Tela';
import { IDetMethodAnalysis } from 'src/app/main/class/Form/PRM/IDetMethod-Analysis';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }



  //#region CODIGO GSD
  GetCodigoGSD(codigo : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetCodigoGSD" + "?codigo=" + codigo );
  }



  GuardarCodigoGSD(d : ICodigoGSD): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarCodigoGSD" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion CODIGO GSD


    //#region PARTES
    GetPartes() : Observable<any>
    {
      return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetPartes");
    }
  
  
  
    GuardarPartes(d : IPartes): Observable<any> { 
      let json = JSON.stringify(d);  
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarPartes" + "?d=" + json,  { 'content-type': 'application/json'});
    }
    //#endregion PARTES



  //#region TELA
  
    GetTela() : Observable<any>
    {
      return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetTela");
    }

    GetTelaAuto(nombre : string) : Observable<any>
    {
      return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetTelaAuto" + "?nombre=" + nombre);
    }

    GuardarTela(d : ITela): Observable<any> { 
      let json = JSON.stringify(d);  
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarTela" + "?d=" + json,  { 'content-type': 'application/json'});
     }
  //#endregion TELA
  


  //#region SEWING
  
  GetSewing(codigo : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetSewing" + "?codigo=" + codigo);
  }



  GuardarSewing(d : ISewing): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarSewing" + "?d=" + json,  { 'content-type': 'application/json'});
   }
//#endregion SEWING



  //#region SEWING ACCURACY
  
  GetSewingAccuracy(level : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetSewingAccuracy" + "?level=" + level);
  }



  GuardarSewingAccuracy(d : ISewingAccuracy): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarSewingAccuracy" + "?d=" + json,  { 'content-type': 'application/json'});
   }
//#endregion SEWING ACCURACY



  //#region OUNCE
  
  GetOunce() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetOunce");
  }



  GuardarOunce(d : IOunce): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarOunce" + "?d=" + json,  { 'content-type': 'application/json'});
   }
  //#endregion OUNCE


  //#region DATA MACHINE
  
  GetDataMachine() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetDataMachine");
  }

  GetDataMachineAuto(nombre : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetDataMachineAuto" + "?nombre=" + nombre);
  }



  GuardarDataMachine(d : IDataMachine): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarDataMachine" + "?d=" + json,  { 'content-type': 'application/json'});
   }
  //#endregion DATA MACHINE



   //#region METHOD ANALISIS
  
   GetMethodAnalysis() : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetMethodAnalysis");
   }
 
   GetMethodAnalysisAuto(nombre : string) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetMethodAnalysisAuto" + "?nombre=" + nombre);
   }
 
   NuevoMethodAnalysis(d : IMethodAnalysis): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/NuevoMethodAnalysis" + "?d=" + json,  { 'content-type': 'application/json'});
   }

 
   GuardarDetMethodAnalysis(d : IDetMethodAnalysis): Observable<any> { 
     let json = JSON.stringify(d);  
     return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarDetMethodAnalysis" + "?d=" + json,  { 'content-type': 'application/json'});
    }


    GuardarMethodAnalysis(d : any): Observable<any> { 
      let json = JSON.stringify(d);  
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarMethodAnalysis" + "?d=" + json,  { 'content-type': 'application/json'});
     }
 
    EliminarMethodAnalysis(IdMethodAnalysis : number): Observable<any> { 
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarMethodAnalysis" + "?IdMethodAnalysis=" + IdMethodAnalysis,  { 'content-type': 'application/text'});
     }
   //#endregion METHOD ANALISIS


  
}
