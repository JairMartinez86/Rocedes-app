import { HttpClient} from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/shared/class/Cnx/conexion';
import { ICodigoGSD } from 'src/app/main/Prm/interface/i-Codigo-GSD';
import { IDataMachine } from '../interface/i-data-machine';
import { IMethodAnalysisData } from '../interface/i-MethodAnalysisData';
import { IOunce } from '../interface/i-Ounce';
import { IPartes } from '../interface/i-Partes';
import { ISewing } from '../interface/i-Sewing';
import { ISewingAccuracy } from '../interface/i-SewingAccuracy';
import { ITela } from '../interface/i-Tela';
import { IFamily } from '../interface/i-Family';
import { ISecuence } from '../interface/i-Secuence';
import { IStitchType } from '../interface/i-Stitch-Type';
import { INeedleType } from '../interface/i-NeedleType';
import { IRpm } from '../interface/i-Rpm';
import { IStitchInch } from '../interface/i-Stitch-inch';


@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  

  private Cnx : Conexion = new Conexion();

  @Output() change: EventEmitter<any> = new EventEmitter();

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



  
  //#region FAMILY
  GetFamily(Components : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetFamily" + "?Components=" + Components );
  }



  GuardarFamily(d : IFamily): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarFamily" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion FAMILY



  //#region SECUENCE
  GetSecuence(Secuence : number) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetSecuence" + "?Secuence=" + Secuence );
  }
  
  
  
  GuardarSecuence(d : ISecuence): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarSecuence" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion SECUENCE


  //#region STITCH TYPE
  GetStitchType(TypeStitch : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetStitchType" + "?TypeStitch=" + TypeStitch );
  }
  
  
  
  GuardarStitchType(d : IStitchType): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarStitchType" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion STITCH TYPE


   //#region NEEDLE TYPE
   GetNeedleType(NeedleType : string) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetNeedleType" + "?NeedleType=" + NeedleType );
   }
   
   
   
   GuardarNeedleType(d : INeedleType): Observable<any> { 
     let json = JSON.stringify(d);  
     return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarNeedleType" + "?d=" + json,  { 'content-type': 'application/json'});
   }
   //#endregion NEEDLE TYPE
    

   //#region RPM
   GetRpm(Rpm : number) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetRpm" + "?Rpm=" + Rpm );
   }
   
   
   
   GuardarRpm(d : IRpm): Observable<any> { 
     let json = JSON.stringify(d);  
     return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarRpm" + "?d=" + json,  { 'content-type': 'application/json'});
   }
   //#endregion RPM



   
  //#region STITCH INCH
  GetStitchInch(StitchInch : number) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetStitchInch" + "?StitchInch=" + StitchInch );
  }
  
  
  
  GuardarStitchInch(d : IStitchInch): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarStitchInch" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion STITCH INCH


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
  

   GetMethodAnalysis(FechaInicio : string, FechaFinal : string) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetMethodAnalysis" + "?FechaInicio=" + FechaInicio  + "&FechaFin=" + FechaFinal);
   }

   GetDetMethodAnalysis(IdMethodAnalysis : number) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetDetMethodAnalysis" + "?IdMethodAnalysis=" + IdMethodAnalysis);
   }
 
   GetMethodAnalysisAuto(nombre : string) : Observable<any>
   {
     return this.http.get<any>(this.Cnx.Url() + "Premium/Operaciones/GetMethodAnalysisAuto" + "?nombre=" + nombre);
   }
 
   GuardarMethodAnalysis(d : IMethodAnalysisData): Observable<any> { 
    return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/GuardarMethodAnalysis", JSON.stringify(d), { headers: {'content-type' : 'application/json'}});
   }

 
    EliminarMethodAnalysis(IdDetMethodAnalysis : number, user : string): Observable<any> { 
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/EliminarMethodAnalysis" + "?IdDetMethodAnalysis=" + IdDetMethodAnalysis + "&user=" + user,  { 'content-type': 'application/text'});
     }

     EliminarMatrixOperacion(IdMethodAnalysis : number, user : string): Observable<any> { 
      return this.http.post<any>(this.Cnx.Url() + "Premium/Operaciones/EliminarMatrixOperacion" + "?IdMethodAnalysis=" + IdMethodAnalysis + "&user=" + user,  { 'content-type': 'application/text'});
     }
   //#endregion METHOD ANALISIS


  
}
