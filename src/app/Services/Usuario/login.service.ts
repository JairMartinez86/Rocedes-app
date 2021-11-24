import { EventEmitter, Injectable, Output, } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, } from '@angular/common/http';
import {Router, CanActivate} from "@angular/router"

import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { ClsUsuario } from 'src/app/class/Form/cls-usuario';
import { Conexion } from 'src/app/class/Cnx/conexion';






@Injectable({
  providedIn: 'root'
})
export class LoginService {

  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();

  isOpen : boolean = false;
  str_Form : string = "";


  str_user : string = "";
  str_pass : string = "";
  str_Fecha : string = "";
  bol_remenber : boolean = false;



  constructor(private http: HttpClient, private router:Router) {


   }


/*************************FUNCIONES LOGIN************************************/

 
  
  InicioSesion(str_user : string, str_Pass : string): Observable<any> {

    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.Cnx.Url() + "Usuario" + "?usr="+str_user+"&pwd="+ str_Pass, { 'content-type': 'application/text'});

  }



  ValidarSession(str_user : string, str_Pass : string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Usuario" + "?usr="+str_user+"&pwd="+ str_Pass);

  }



  VerificarSession() {


    if(localStorage.getItem("User") != null)
    {
      this.str_user = <string>localStorage.getItem("User");
      this.str_pass = <string>localStorage.getItem("Pwd");
      this.bol_remenber = true;
    }

    if(this.str_user == "") {
      this.CerrarSession();
      return;
    }
    if(this.str_pass == "") {
      this.CerrarSession();
      return;
    }

  
    this.ValidarSession(this.str_user, this.str_pass).subscribe(datos => {
 
      let _json = (JSON.parse(datos));
      

      if(Object.keys(_json["d"]).length > 0)
      {

        this.GuardarSession(this.bol_remenber,  this.str_user, this.str_pass, _json["d"]["Fecha"]);
        return;
      }
      else
      {
        this.CerrarSession();
        return;
      }

    } );

    return;
  }
    



  CerrarSession() : void{
    
    this.str_user = "";
    this.str_pass = "";
    this.str_Fecha = "";

    localStorage.removeItem("User");
    localStorage.removeItem("Pwd");
    localStorage.removeItem("Fecha");

    sessionStorage.removeItem("User");
    sessionStorage.removeItem("Pwd");
    sessionStorage.removeItem("Fecha");

    this.router.navigate(['/login'], { skipLocationChange: false });
  }

  GuardarSession(bol_remenber : boolean, str_user : string, str_pass : string, str_Fecha : string ) : void
  {
    this.str_user = str_user;
    this.str_pass = str_pass;
    this.str_Fecha = str_Fecha;
    this.bol_remenber = bol_remenber;


    if(bol_remenber)
    {
      localStorage.setItem('User', str_user);
      localStorage.setItem('Pwd', str_pass);
      localStorage.setItem('Fecha', str_Fecha);
    }

    sessionStorage.setItem('User', str_user);
    sessionStorage.setItem('Pwd', str_pass);
    sessionStorage.setItem('Fecha', str_Fecha);

    this.router.navigate(['/main'], { skipLocationChange: false });
  }




/****************************************************************************/

/*************************FUNCIONES FORMULARIO USUARIO***********************/

  
  BuscarCodBarra(str_datos : string): Observable<any> {
    return this.http.get<any>(this.Cnx.Url() + "Usuario" + "?codbar="+str_datos);

  }

  BuscarRegistros(): Observable<any> {
    return this.http.get<any>(this.Cnx.Url() + "Usuario/Registros");
  }


  
  Nuevo(Usuario: ClsUsuario): Observable<any> {

    let json = JSON.stringify(Usuario);          
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(this.Cnx.Url() + "Usuario/NuevoUsuario" + "?d="+json, { 'content-type': 'application/text'});

  }

  Editar(Usuario: ClsUsuario): Observable<any> {

    let json = JSON.stringify(Usuario);          
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(this.Cnx.Url() + "Usuario/EditarUsuario" + "?d="+json, { 'content-type': 'application/text'});

  }

/****************************************************************************/

Abrir(m : string) {
  this.isOpen = true;
  this.str_Form = m;
  this.change.emit(this.str_Form);
}

Cerrar() {
  this.isOpen = false;
  this.str_Form = "";
  this.change.emit(this.str_Form);
}
  


}
