
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Validacion } from 'src/app/class/Validacion/validacion';
import { AuditoriaService } from 'src/app/Services/Aut/auditoria.service';
import {InventarioService} from 'src/app/Services/inv/inventario.service'; 
import { DialogoComponent } from '../../otro/dialogo/dialogo.component';


export interface IBoxin {
  cIndex: number;
  cSerial : number;
  cNomPieza : string;
  cSeccion: number;
  cNoBulto: number;
  cCapaje: number;
  cNoSaco: number;
  cEscaneado : boolean;
  cAccion : string;
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

 


  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
      if(this.dataSource.paginator != null)this.dataSource.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    }
  }

  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Seriales`;  // customize this line
    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length 
      ? Math.min(startIndex + pageSize, length) 
      : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} de ${endIndex} Total: ${length}`; // customize this line
  };

  

  optionCorte : ICorte[] = [];
  filteredOptions!: Observable<ICorte[]>;


  displayedColumns: string[] = ["cIndex", "cSerial","cNomPieza",  "cSeccion", "cNoBulto", "cCapaje", "cNoSaco", "cEscaneado"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<IBoxin>();

  public valSeleccion = new Validacion();
  public val = new Validacion();

  str_from : string = "";
  str_Corte :string = "";

  checked   = true;
  bol_IniciarEmpaque : boolean = false;
  bol_AbrirSaco : boolean = false;
  bol_TerminarEmpaque : boolean = false;

  checkValue(){
    this.checked = !this.checked
  }



  //#region DIALOGO

  clickoutHandler!: Function;
  dialogRef!: MatDialogRef<DialogoComponent>;


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
        this.dialogRef.componentInstance.autoClose = true;
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

  let _Opcion : any = this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionCorte.filter( f => f.Corte == this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.value)[0]

    if(_Opcion == null){
      this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.setValue("");
      return;
    }
    
  }



  
  this.str_Corte = _Opcion.Corte;
  this.str_from = "frmBundleBoxing_Cuerpo"
  this.bol_AbrirSaco = false;
  this.cargarTabla();
}

Complemento(): void{
  
}
//#endregion FORMULARIO SELECCION

    
    
  //#region FORMULARIO EMPAQUE

  cargarTabla(){
    
    
    let seccion :number = 0

    if(this.str_Corte.indexOf("-") != -1){
      seccion = Number.parseInt( this.str_Corte[this.str_Corte.indexOf("-") + 1]);
    } 

    this.dataSource.data.splice(0, this.dataSource.data.length);

    this.AuditoriaService.GetSerial2(this.str_Corte).subscribe(s=>{

      let _json = JSON.parse(s);

      if(_json["esError"] == 0){

        if(_json["count"] > 0){

          let i : number = 1;
          _json["d"].forEach((b:{Serial : number, NomPieza : string, NoBulto : number, Capaje : number, Corte : string, Oper : string}) => {
            this.dataSource.data.push({cIndex: i, cSerial : b.Serial, cNomPieza : b.NomPieza , cSeccion: seccion , cNoBulto : b.NoBulto, cCapaje: b.Capaje, cNoSaco: 0, cEscaneado : false, cAccion : "uncheck"})
          
            i+=1;
          });


        }

      }
      else{


        this.dialogRef = this.dialog.open(DialogoComponent, {
          data: _json["msj"]
        })


        this.dialogRef.afterOpened().subscribe(() => {
          this.dialogRef.componentInstance.autoClose = true;
        });
  
        
      }

     
      this.dataSource.filter = "";

    });
   


  }

  Empacar(): void{

    if(this.val.ValForm.invalid) return;

    this.bol_IniciarEmpaque = !this.bol_IniciarEmpaque;
    this.bol_AbrirSaco = false;
    this.bol_TerminarEmpaque = false;
    this.dataSource.filter = "";
    this.val.ValForm.get("txtBox_Mesa")?.disable();

  }
  

  CerrarEmpaque() : void{

    this.bol_IniciarEmpaque = false;
    this.dataSource.filter = "";
    this.val.ValForm.get("txtBox_Mesa")?.enable();
    document.getElementById("txtBox_Mesa")?.focus();
      
  }

  TerminarEmpaque() :void{
    this.bol_TerminarEmpaque = true;
  }



  AbrirSaco(e: Event, evento : string) : void{

    this.bol_AbrirSaco = !this.bol_AbrirSaco;

    let element = <HTMLElement>document.getElementById("btnBoxin_AbrirSaco");

    if(this.bol_AbrirSaco){
      element.innerText = "Cerrar Saco";
    }
    else{
      element.innerText = "Abrir Saco";
    }
    


  }

  filtrar(event: Event) {
    let filtro : string = (event.target as HTMLInputElement).value;

    if(filtro == "NO ESCANEADO") filtro = "uncheck"
    if(filtro == "ESCANEADO") filtro = "check"

    this.dataSource.filter = filtro.trim().toLowerCase();
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
