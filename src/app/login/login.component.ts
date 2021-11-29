import { Component, OnInit } from '@angular/core';
import {LoginService} from '../Services/Usuario/login.service'; 




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})



export class LoginComponent implements OnInit {
  str_user : string = '';
  str_pass : string = '';
  bol_remenber : boolean = false;
 





  constructor(private loginserv : LoginService) { 
    this.loginserv.VerificarSession();
    this.str_user = this.loginserv.str_user;
    this.str_pass = this.loginserv.str_pass;
    this.bol_remenber = this.loginserv.bol_remenber;
  }


  
  InicioSesion() : void{

    this.loginserv.InicioSesion(this.str_user, this.str_pass).subscribe(datos => {
      
      
      let _json = (JSON.parse(datos));

      
      if(Object.keys(_json["d"]).length > 0)
      {
        
        this.loginserv.GuardarSession(this.bol_remenber, this.str_user, this.str_pass, _json["d"]["Nombre"], _json["d"]["Fecha"]);
      }
     
    } );

  }



  ngOnInit(): void {

   // this.loginserv.InicioSesion().subscribe(datos => this.data$ = JSON.stringify(datos) );
  // this.loginserv.VerificarSession();

  }

  

}
