
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith, Subject, timer } from 'rxjs';
import { Validacion } from 'src/app/class/Validacion/validacion';
import { AuditoriaService } from 'src/app/Services/Aut/auditoria.service';
import { BundleBoningService } from 'src/app/Services/inv/BundleBoxing/bundle-boning.service';
import {InventarioService} from 'src/app/Services/inv/inventario.service'; 
import { LoginService } from 'src/app/Services/Usuario/login.service';
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

const VerificarScanTimer = timer(0, 300000);



const stop$ = new Subject<void>();
function stop() {
  stop$.next();
  stop$.complete();
}


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

  @ViewChild(MatSort, {static: false})
  set sort(sort: MatSort) {
     this.dataSource.sort = sort;
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
  str_Seccion : string = "";
  str_Titulo_Saco : string = "";

  int_Saco : number = 0;

  checked   = true;
  bol_IniciarEmpaque : boolean = false;
  bol_AbrirSaco : boolean = false;
  bol_TerminarEmpaque : boolean = false;
  bol_Verificando : boolean = false;

  checkValue(){
    this.checked = !this.checked
  }


  number$Subscription : any

  //#region DIALOGO

  clickoutHandler!: Function;
  dialogRef!: MatDialogRef<DialogoComponent>;


  //#endregion DIALOGO



  
  constructor(private LoginService : LoginService, private InventarioService : InventarioService, private AuditoriaService : AuditoriaService, private BundleBoningService : BundleBoningService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer ) {

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
      this.number$Subscription = VerificarScanTimer.subscribe(() => {
        this.VerificarEscanneado();
      });
      
    }

    if(form == "frmBundleBoxing_Cuerpo"){
      this.str_from = "BundleBoxing";

      this.number$Subscription.unsubscribe();
    }

    this.LimpiarForm(form);
    
  }

  LimpiarForm(form : string) : void{

    if(form == ""){
     
      this.str_Titulo_Saco = "";
      this.valSeleccion.ValForm.get("txtBox_SeleccionCorte")?.setValue("");


      this.val.ValForm.reset();
      this.valSeleccion.ValForm.reset();


    }

    if(form == "frmBundleBoxing_Cuerpo"){
      this.str_Titulo_Saco = "";
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
  this.str_Corte = this.str_Corte.trimEnd();
  this.str_Seccion = "";

  if(this.str_Corte.indexOf("-") != -1){
    this.str_Seccion =  this.str_Corte[this.str_Corte.indexOf("-") + 1];
  } 

  this.str_from = "frmBundleBoxing_Cuerpo"
  this.bol_AbrirSaco = false;
  this.cargarTabla();

  this.number$Subscription = VerificarScanTimer.subscribe(() => {
    this.VerificarEscanneado();
  });
  
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
          _json["d"].forEach((b:{Serial : number, Nombre : string, Bulto : number, Capaje : number, Saco : number, Corte : string, Oper : string, Escaneado : boolean}) => {
            this.dataSource.data.push({cIndex: i, cSerial : b.Serial, cNomPieza : b.Nombre , cSeccion: seccion , cNoBulto : b.Bulto, cCapaje: b.Capaje, cNoSaco: b.Saco, cEscaneado : b.Escaneado, cAccion : b.Escaneado === true ? "check" : "uncheck"})
          
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
    

    this.str_Titulo_Saco = "";

    if(evento == "Crear") this.int_Saco = 0;

    if(this.dataSource.data.length == 0) return;


    this.BundleBoningService.Saco(this.LoginService.str_user, this.str_Corte, this.str_Seccion, this.int_Saco.toString()).subscribe( s => {


      let _json = JSON.parse(s)

      if(_json["esError"] == 0){

        if(_json["count"] > 0)
        {


          if(evento == "Crear")
          {
            this.int_Saco = Number.parseInt(_json["d"][0].Saco);
            this.str_Titulo_Saco = " Saco # " + _json["d"][0].Saco;
          }
          

          
          this.bol_AbrirSaco = !this.bol_AbrirSaco;

          let element = <HTMLElement>document.getElementById("btnBoxin_AbrirSaco");


          if(this.bol_AbrirSaco){
            element.innerText = "Cerrar Saco";
          }
          else{
            element.innerText = "Abrir Saco";
          }

        }


      }
      else{

        this.dialogRef = this.dialog.open(DialogoComponent, {
          data: _json["msj"],
        });

        this.dialogRef.componentInstance.autoClose = true;

      }
      

    });


  }

  filtrar(event: Event) {
    let filtro : string = (event.target as HTMLInputElement).value;

    if(filtro == "NO ESCANEADO") filtro = "uncheck"
    if(filtro == "ESCANEADO") filtro = "check"

    this.dataSource.filter = filtro.trim().toLowerCase();
  }  
 

  
  VerificarEscanneado() {
    
      if(this.bol_Verificando) return;

      this.BundleBoningService.GetSerialesEscaneado(this.str_Corte).subscribe( s =>{

        let _json = JSON.parse(s);

        this.dataSource.data.forEach((Fila, IBoxin) => {
          Fila.cEscaneado = false;
          Fila.cNoSaco = 0;

          if(_json["count"] > 0){
            _json["d"].forEach((d: { Serial : number, Bulto : number, Saco : number}) => {

              if(Fila.cSerial == d.Serial && Fila.cNoBulto == d.Bulto) {
                Fila.cNoSaco = d.Saco;
                Fila.cEscaneado = true;
                return;
              }

            });

          }


        });

        this.bol_Verificando = false;


      });
  
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
