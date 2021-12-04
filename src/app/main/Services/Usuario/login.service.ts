import { EventEmitter, Injectable, Output, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router"

import { Observable } from 'rxjs';

import { Conexion } from '../../class/Cnx/conexion';
import { BnNgIdleService } from 'bn-ng-idle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogoComponent } from '../../otro/dialogo/dialogo.component';
import { ClsUsuario } from '../../class/Form/sis/cls-usuario';






@Injectable({
  providedIn: 'root'
})
export class LoginService {

  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();

  private isCancel : boolean = false;
  public isOpen : boolean = false;
  public isLoguin : boolean = false;
  bol_remenber : boolean = false;


  Nombre : string = "";
  str_Form : string = "";
  str_user : string = "";
  str_pass : string = "";
  str_Fecha : string = "";
  


  
  //#region DIALOGO


  dialogRef!: MatDialogRef<DialogoComponent>;

  //#endregion DIALOGO
  

  constructor(private http: HttpClient, private router:Router, private bnIdle1: BnNgIdleService, private bnIdle2: BnNgIdleService, public dialog: MatDialog ) {


   }


/*************************FUNCIONES LOGIN************************************/

 
  
  InicioSesion(str_user : string, str_Pass : string): Observable<any> {

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
      this.Nombre = <string>localStorage.getItem("Nombre");
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

        this.GuardarSession(this.bol_remenber,  this.str_user, this.str_pass, _json["d"][0]["Nombre"], _json["d"][0]["Fecha"]);
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
    localStorage.removeItem("Nombre");

    sessionStorage.removeItem("User");
    sessionStorage.removeItem("Pwd");
    sessionStorage.removeItem("Fecha");
    sessionStorage.removeItem("Nombre");

    this.isLoguin = false;


    this.router.navigate(['/login'], { skipLocationChange: false });
  }

  GuardarSession(bol_remenber : boolean, str_user : string, str_pass : string, str_Nombre : string, str_Fecha : string ) : void
  {
    this.Nombre = str_Nombre;
    this.str_user = str_user;
    this.str_pass = str_pass;
    this.str_Fecha = str_Fecha;
    this.bol_remenber = bol_remenber;


    if(bol_remenber)
    {
      localStorage.setItem('Nombre', str_Nombre);
      localStorage.setItem('User', str_user);
      localStorage.setItem('Pwd', str_pass);
      localStorage.setItem('Fecha', str_Fecha);
    }

    sessionStorage.setItem('Nombre', str_Nombre);
    sessionStorage.setItem('User', str_user);
    sessionStorage.setItem('Pwd', str_pass);
    sessionStorage.setItem('Fecha', str_Fecha);

    this.isLoguin = true;
    this.router.navigate(['/main'], { skipLocationChange: false });
    this.change.emit(this.str_Form);
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
    return this.http.post<any>(this.Cnx.Url() + "Usuario/NuevoUsuario" + "?d="+json, { 'content-type': 'application/json'});

  }

  Editar(Usuario: ClsUsuario): Observable<any> {

    let json = JSON.stringify(Usuario);          
    return this.http.post<any>(this.Cnx.Url() + "Usuario/EditarUsuario" + "?d="+json, { 'content-type': 'application/json'});

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
  

  //#region TIMEOUT

  private TimeOutSalir(TimeClose : number) :void{
    this.bnIdle2.startWatching(TimeClose).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && !this.isCancel) {
        this.dialog.getDialogById("TimeOut")?.close();
        this.bnIdle1.stopTimer();
        this.bnIdle2.stopTimer();
        this.CerrarSession();
      }
    });
  }
  
  TimeOut() :void{
    //this.clickoutHandler = this.vacio;
    
    this.bnIdle1.startWatching(this.Cnx.TimeVerif).subscribe((isTimedOut: boolean) => 
    {
      if (isTimedOut) {
        this.bnIdle1.stopTimer();
      
      
        let _json = JSON.parse("{\"Codigo\": \"\",\"Mensaje\": \"Tu sessión va a expirar pronto.\"}");
        
        if(this.dialog.getDialogById("TimeOut") == null){
          this.dialogRef = this.dialog.open(DialogoComponent, {
            id:"TimeOut",
            data: _json,
          });
        }
        else{
          this.dialogRef != this.dialog.getDialogById("TimeOut");
        }

        this.isCancel = false;
        this.bnIdle2.stopTimer();
        this.TimeOutSalir(this.Cnx.TimeClose);
      
    
      /*this.dialogRef.afterOpened().subscribe(() => {
        this.isCancel = false;
        this.bnIdle2.stopTimer();
        this.TimeOutSalir(TimeClose);
      });*/
    
      this.dialogRef.afterClosed().subscribe(() => {
        this.isCancel = true;
        this.bnIdle2.stopTimer();
        
        if(this.isLoguin) this.TimeOut();

        });
      
      }
    });
  
}
  
  
  //#endregion TIMEOUT




}
