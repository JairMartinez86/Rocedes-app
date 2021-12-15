import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { AuditoriaService } from 'src/app/main/Services/Aut/auditoria.service';
import { InventarioService } from 'src/app/main/Services/inv/inventario.service';
import { LoginService } from 'src/app/main/Services/Usuario/login.service';



export interface ICorte {
  Corte: string;
}

@Component({
  selector: 'app-bundle-boxing-envio',
  templateUrl: './bundle-boxing-envio.component.html',
  styleUrls: ['./bundle-boxing-envio.component.css']
})
export class BundleBoxingEnvioComponent implements OnInit {


  public str_from : string = ""; 
  public SeleccionPolin : string  ="1";
  public str_Corte : string = "";

  public bol_Load : boolean = false;

  public val = new Validacion();

  constructor(private LoginService : LoginService, private InventarioService : InventarioService, private AuditoriaService : AuditoriaService,
    private dialog: MatDialog) { 
    this.Limpiar();

    this.val.add("txt_Corte", "1", "LEN>", "0");
    this.val.add("txtSerial", "1", "LEN>", "0");
    this.val.add("txtBox_Polin", "1", "LEN>", "0");
    

  }



  private Limpiar() : void
  {
    this.str_from = "";
    this.SeleccionPolin = "1";
    this.str_Corte = "";
    this.bol_Load = false;

    this.val.ValForm.reset();
  }

  public Cerrar() : void
  {
    this.Limpiar();
  }






  
  //#region AUTO COMPLETADO
	
  optionCorte : ICorte[] = [];
  filteredOptions!: Observable<ICorte[]>;

  txt_Corte_onSearchChange(event : any) :void{

  this.optionCorte.splice(0, this.optionCorte.length);

  if(event.target.value == null) return;

  let value : string = event.target.value;

  if(value.length <= 2) return;

  
  this.AuditoriaService.GetCorte(value, false).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((b: {  Corte : string}) => {
          this.optionCorte.push({Corte : b.Corte});
        });

        this.filteredOptions = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Corte)),
          map(Corte => (Corte ? this._FiltroSeleccion(Corte) : this.optionCorte.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });



}


txt_Corte_onKeyEnter(event: any){
    

  let _input : string = event.target.id;
  

  if(event.target.value == "") {
    document?.getElementById(_input)?.focus();
    event.preventDefault();
    return;
  }



  
  let _Opcion : any = this.val.ValForm.get("txt_Corte")?.value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionCorte.filter( f => f.Corte == this.val.ValForm.get("txt_Corte")?.value)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_Corte")?.setValue("");
      return;
    }
    
  }

  this.str_Corte = _Opcion.Corte;




  event.preventDefault();

}



MostrarCorteSelec(Registro: ICorte): string {
  if(Registro == null) return "";
  return Registro.Corte;
}

private _FiltroSeleccion(Corte: string): ICorte[] {
  const filterValue = Corte.toLowerCase();
  return this.optionCorte.filter(option => option.Corte.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO



  ngOnInit(): void {

    this.InventarioService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkBundleBoxingEnvio"){
        this.Limpiar();
        this.str_from = "Envio";
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkBundleBoxingEnvio"){
        this.Limpiar();
      }
      
    });

  }

}
