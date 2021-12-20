import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { ConfiguracionService } from 'src/app/main/Services/sis/configuracion.service';
import { LoginService } from 'src/app/main/Services/Usuario/login.service';


export interface IUsuario {
  Login: string;
}

@Component({
  selector: 'app-acceso-link',
  templateUrl: './acceso-link.component.html',
  styleUrls: ['./acceso-link.component.css']
})
export class AccesoLinkComponent implements OnInit {


  public val = new Validacion();
  public str_frm : string = "";

  
  optionUsuario : IUsuario[] = [];
  filteredOptions!: Observable<IUsuario[]>;

  constructor(private dialog : MatDialog, private _LoginService : LoginService, private _ConfiguracionService : ConfiguracionService) {

    this.val.add("txt_SIS_AccesoUsuario", "1", "LEN>", "0");
    this.Limpiar();
   }



   public Limpiar() : void
   {
     this.str_frm = "";
   }


//#region FORMULARIO SELECCION
	
txt_SIS_AccesoUsuario_onSearchChange(event : any) :void{

  this.optionUsuario.splice(0, this.optionUsuario.length);

  if(event.target.value == null) return;

  let value : string = event.target.value;

  if(value.length <= 2) return;



  
  this._LoginService.BuscarUsuario(value).subscribe( s => {
    let _json = JSON.parse(s);

    this.dialog.closeAll();

    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach(( f : IUsuario) => {
          this.optionUsuario.push(f);
        });

        this.filteredOptions = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Corte)),
          map(Corte => (Corte ? this._FiltroSeleccion(Corte) : this.optionUsuario.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })

    }

  });



}

MostrarUsuarioSelec(Registro: IUsuario): string {
  if(Registro == null) return "";
  return Registro.Login;
}

private _FiltroSeleccion(Login: string): IUsuario[] {
  const filterValue = Login.toLowerCase();
  return this.optionUsuario.filter(option => option.Login.toLowerCase().startsWith(filterValue));
}



//#endregion FORMULARIO SELECCION


  ngOnInit(): void {

    this._ConfiguracionService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkUsuarioPerfil"){
        this.Limpiar();
        this.str_frm = "PerfilUsuario"
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkUsuarioPerfil"){
        this.Limpiar();
      }
      
    });
  }


}
