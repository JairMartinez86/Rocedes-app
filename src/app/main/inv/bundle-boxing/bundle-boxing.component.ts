
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Validacion } from 'src/app/class/Validacion/validacion';
import { AuditoriaService } from 'src/app/Services/Aut/auditoria.service';
import {InventarioService} from 'src/app/Services/inv/inventario.service'; 
import { DialogoComponent } from '../../otro/dialogo/dialogo.component';


export interface IBoxin {
  cIndex: number;
  cNomPieza : string;
  cSeccion: number;
  cNoBulto: number;
  cCapaje: number;
  cNoSaco: number;
  cAccion : boolean;
}

export interface ICorte {
  Corte: string;
}



let ELEMENT_DATA: IBoxin[] = [
  
];



@Component({
  selector: 'app-bundle-boxing',
  templateUrl: './bundle-boxing.component.html',
  styleUrls: ['./bundle-boxing.component.css']
})
export class BundleBoxingComponent implements OnInit {

  public valSeleccion = new Validacion();

  public val = new Validacion();

  str_from : string = "";
  str_Corte :string = "";

  optionCorte : ICorte[] = [];
  filteredOptions!: Observable<ICorte[]>;



  displayedColumns: string[] = ['cIndex', 'cNomPieza',  'cSeccion', 'cNoBulto', "cCapaje", "cNoSaco", "cAccion"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<IBoxin>();


  bol_IniciarEscaneo : boolean = false




  //#region DIALOGO
  @HostListener('document:click', ['$event'])
  clickout(event : any) {
    if (this.clickoutHandler) {
      this.clickoutHandler(event);
    }
  }
  clickoutHandler!: Function;
  dialogRef!: MatDialogRef<DialogoComponent>;

  closeDialogFromClickout(event: MouseEvent) {
    const matDialogContainerEl = this.dialogRef.componentInstance.hostElement.nativeElement.parentElement;
    const rect = matDialogContainerEl.getBoundingClientRect()

    if(event.clientX <= rect.left || event.clientX >= rect.right || 
        event.clientY <= rect.top || event.clientY >= rect.bottom) {
          this.dialogRef.close();
    }
  }

  vacio() : void{
      
  }
  
  //#endregion DIALOGO



  
  constructor(private InventarioService : InventarioService, private AuditoriaService : AuditoriaService, public dialog: MatDialog ) {

    this.valSeleccion.add("txtBox_SeleccionCorte", "1", "LEN>", "0");

    this.val.add("txtBox_Mesa", "1", "LEN>", "0");

    this.dataSource.data.splice(0, this.dataSource.data.length)

    this.LimpiarForm("");

   }



  Abrir() : void{

  }

  Cerrar(form : string) : void{

    if(form == ""){
      this.str_from = "";
      
    }

    if(form == "frmBundleBoxing_Cuerpo"){
      this.str_from = "BundleBoxing";
    }

    this.LimpiarForm(form);
    
  }

  LimpiarForm(form : string) : void{

    if(form == ""){
     
      this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.setValue("");

      this.val.ValForm.reset();
      this.valSeleccion.ValForm.reset();


    }

    if(form == "frmBundleBoxing_Cuerpo"){
      this.val.ValForm.reset();

    }


    if( this.dialogRef != null)this.dialogRef.close();
    
  }


 






//#region FORMULARIO SELECCION
	
txtBox_SeleccionCorte_onSearchChange(event : any) :void{

  this.optionCorte.splice(0, this.optionCorte.length);

  if(event.target.value == null) return;

  let value : string = event.target.value;

  if(value.length <= 2) return;

  
  this.AuditoriaService.GetPOrder(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((b: {  Corte : string}) => {
          this.optionCorte.push({Corte : b.Corte});
        });

        this.filteredOptions = this.valSeleccion.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Corte)),
          map(Corte => (Corte ? this._FiltroSeleccion(Corte) : this.optionCorte.slice())),
        );
       
      }
     
    }else{
      this.dialogRef = this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })

      this.dialogRef.afterOpened().subscribe(() => {
        this.clickoutHandler = this.closeDialogFromClickout;
      });


      this.dialogRef.afterClosed().subscribe(() => {
        this.clickoutHandler = this.vacio;
      });


    }

  });



}

MostrarCorteSelec(Registro: ICorte): string {
  if(Registro == null) return "";
  return Registro.Corte;
}

private _FiltroSeleccion(Corte: string): ICorte[] {
  const filterValue = Corte.toLowerCase();

  return this.optionCorte.filter(option => option.Corte.toLowerCase().startsWith(filterValue));
}




Cuerpo() : void{

  let _Opcion : ICorte = this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.value;

  if( typeof(_Opcion) == 'string' ) {
    this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.setValue("");
    return
  }

  this.str_Corte = _Opcion.Corte;
  this.str_from = "frmBundleBoxing_Cuerpo"
}

Complemento(): void{
  
}
//#endregion FORMULARIO SELECCION

    
    
  //#region FORMULARIO EMPAQUE

  Empacar(): void{

    if(this.val.ValForm.invalid) return;

    this.bol_IniciarEscaneo = !this.bol_IniciarEscaneo;

    let element = <HTMLElement>document.getElementById("btnBoxin_Empacar");

    document.getElementById("btnBoxin_Empacar")?.classList.remove("btn-outline-info");
    document.getElementById("btnBoxin_Empacar")?.classList.remove("btn-btn-info");

    this.dataSource.data.splice(0, this.dataSource.data.length);

    if(this.bol_IniciarEscaneo){
      element.classList.remove("btn-outline-info");
      element.textContent = "Cancerlar Empaque";

      this.AuditoriaService.GetSerial2(this.str_Corte).subscribe(s=>{

        let _json = JSON.parse(s);

        if(_json["esError"] == 0){

          if(_json["count"] > 0){

            let i : number = 1;
            _json["d"].array.forEach((b:{NomPieza : string, Seccion : number, NoBulto : number, Capaje : number, NoSaco : number, Accion : boolean}) => {
              this.dataSource.data.push({cIndex: i, cNomPieza : b.NomPieza  + i.toString(), cSeccion: 1 , cNoBulto : i, cCapaje: 24, cNoSaco: 1, cAccion : false})
            
              i+=1;
            });


          }

        }
        else{


          this.dialogRef = this.dialog.open(DialogoComponent, {
            data: _json["msj"]
          })


          this.dialogRef.afterOpened().subscribe(() => {
            this.clickoutHandler = this.closeDialogFromClickout;
          });
    
    
          this.dialogRef.afterClosed().subscribe(() => {
            this.clickoutHandler = this.vacio;
          });

          
          
        }

       

      });
     

      this.dataSource.filter = "";

      
    }
    else{
      this.val.ValForm.get("txtBox_Mesa")?.setValue("");
      document.getElementById("txtBox_Mesa")?.focus();
      element.classList.add("btn-btn-info");
      element.textContent = "Iniciar Empaque";
    }
    
    
  }
  
  //#endregion FORMULARIO EMPAQUE





  ngOnInit(): void {
    this.InventarioService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "BundleBoxing"){
        this.str_from = "BundleBoxing";
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "BundleBoxing"){
        this.str_from = "";
      }
      
    });
  }

  
}
