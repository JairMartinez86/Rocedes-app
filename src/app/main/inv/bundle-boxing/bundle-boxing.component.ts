
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith, Subject, timer } from 'rxjs';
import { ClsBundleBoxing } from 'src/app/class/Form/Inv/cls-bundle-boxing';
import { ClsSacoEstado } from 'src/app/class/Form/Inv/cls-saco-estado';
import { Validacion } from 'src/app/class/Validacion/validacion';
import { AuditoriaService } from 'src/app/Services/Aut/auditoria.service';
import { BundleBoningService } from 'src/app/Services/inv/BundleBoxing/bundle-boxing.service';
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
  cCorte: string;
  cOper: string;
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
  public valSaco = new Validacion();

  str_from : string = "";
  str_Corte :string = "";
  str_Titulo_Saco : string = "";

  int_Saco : number = 0;
  int_Seccion : number = 0;

  checked   = true;
  bol_IniciarEmpaque : boolean = false;
  bol_AbrirSaco : boolean = false;
  bol_TerminarEmpaque : boolean = false;
  bol_Verificando : boolean = false;

  checkValue(){
    this.checked = !this.checked
  }


  Timer$Subscription : any

  //#region DIALOGO

  clickoutHandler!: Function;
  dialogRef!: MatDialogRef<DialogoComponent>;

  dialogSaco!: MatDialogRef<BundleBoxingComponent>;


  //#endregion DIALOGO



  
  constructor(private LoginService : LoginService, private InventarioService : InventarioService, private AuditoriaService : AuditoriaService, private BundleBoningService : BundleBoningService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer ) {

    this.valSeleccion.add("txtBox_SeleccionCorte", "1", "LEN>", "0");

    this.val.add("txtBox_Mesa", "1", "LEN>", "0");

    this.valSaco.add("txtBox_Saco", "1", "LEN>", "0")
    this.valSaco.add("txtBox_Saco", "2", "NUM>", "0")

    this.LimpiarForm("");

  
   }



  Abrir() : void{

  }

 

  Cerrar(form : string) : void{


    if(form == ""){
      this.str_from = "";
      this.Timer$Subscription = VerificarScanTimer.subscribe(() => {
        this.VerificarEscanneado();
      });
      
    }

    if(form == "frmBundleBoxing_Cuerpo"){
      this.str_from = "BundleBoxing";

      this.Timer$Subscription.unsubscribe();
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
  this.int_Seccion = 0;

  if(this.str_Corte.indexOf("-") != -1){
    this.int_Seccion =  Number(this.str_Corte[this.str_Corte.indexOf("-") + 1]);
  } 

  this.str_from = "frmBundleBoxing_Cuerpo"
  this.bol_AbrirSaco = false;
  this.cargarTabla();

  this.Timer$Subscription = VerificarScanTimer.subscribe(() => {
    this.VerificarEscanneado();
  });
  
}

Complemento(): void{
  
}
//#endregion FORMULARIO SELECCION

    
    
  //#region FORMULARIO EMPAQUE


   //#region EVENTO TABLA

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
            this.dataSource.data.push({cIndex: i, cSerial : b.Serial, cNomPieza : b.Nombre , cSeccion: seccion , cNoBulto : b.Bulto, cCapaje: b.Capaje, cNoSaco: b.Saco, cEscaneado : b.Escaneado, cAccion : b.Escaneado === true ? "check" : "uncheck", cCorte : b.Corte, cOper : b.Oper})
          
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
          Fila.cAccion = "uncheck";

          if(_json["count"] > 0){
            _json["d"].forEach((d: { Serial : number, Bulto : number, Saco : number}) => {

              if(Fila.cSerial == d.Serial && Fila.cNoBulto == d.Bulto) {
                Fila.cNoSaco = d.Saco;
                Fila.cEscaneado = true;
                Fila.cAccion = "check";
                return;
              }

            });

          }


        });

        this.bol_Verificando = false;


      });
  
  }
 
 
  txtBox_EscanSerial_Change(event : any) : void{
    this.GuardarPiezaEscaneada(event.target.value);
  }

  txtBox_EscanSerial_KeyEnter(event :any){
    this.GuardarPiezaEscaneada(event.target.value);
  }

  GuardarPiezaEscaneada(_Serial : string) : void{
    if(_Serial.length <= 2) return


    let _Fila : IBoxin =  <IBoxin>this.dataSource.data.find( f => f.cSerial == Number(_Serial) && !f.cEscaneado)
    let Boxing  : ClsBundleBoxing = new ClsBundleBoxing();


    if(_Fila != null){

      Boxing.Serial = _Fila.cSerial;
      Boxing.Nombre = _Fila.cNomPieza;
      Boxing.Seccion = _Fila.cSeccion;
      Boxing.Bulto = _Fila.cNoBulto;
      Boxing.Capaje = _Fila.cCapaje;
      Boxing.Saco = this.int_Saco;
      Boxing.Corte = _Fila.cCorte;
      Boxing.Oper = _Fila.cOper;
      Boxing.Escaneado = true;


      this.BundleBoningService.Pieza(Boxing).subscribe( s =>{


        let _json = JSON.parse(s);

        if(_json["esError"] == 0)
        {

          if(_json["count"] > 0)
          {
            _Fila.cEscaneado = true;
            _Fila.cNoSaco = _json["d"][0].Saco;
            _Fila.cAccion = "check";
          }


        }
        else
        {

          this.dialogRef = this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })

        }

      });

    }


  }

   //#endregion EVENTO TABLA

   
 
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


   //#region EVENTOS CREAR, CERRAR, ABIR SACO

   BuscarSaco() :void{

    if(this.valSaco.ValForm.invalid) return;

    this.int_Saco = Number.parseInt(this.valSaco.ValForm.get("txtBox_Saco")?.value);
    this.GuardarSaco("Abrir")
  }

  CerrarDialogoSaco() :void{ 
    this.BundleBoningService.change.emit("Close:Saco");
  }


  

  AbrirSaco() : void{

    if(!this.bol_AbrirSaco)
    {
      this.dialogSaco = this.dialog.open(BundleBoxingComponent, { id: "DialogBundleBoxingComponent" });
      this.dialogSaco.componentInstance.str_from = "frmBundleBoxing_Saco";
      this.dialogSaco.componentInstance.str_Corte = this.str_Corte;
      this.dialogSaco.componentInstance.int_Seccion = this.int_Seccion;
      
      this.dialogSaco.afterOpened().subscribe( s =>{
      document.getElementById("divBundleBoxing")?.classList.add("disabled");
        document.getElementById("divRegistrosUsuario")?.classList.add("disabled");
        document.getElementById("divBundleBoxing")?.classList.add("disabled");
      });

      this.dialogSaco.afterClosed().subscribe( s =>{
        document.getElementById("divBundleBoxing")?.classList.remove("disabled");
        document.getElementById("divRegistrosUsuario")?.classList.remove("disabled");
        document.getElementById("divBundleBoxing")?.classList.remove("disabled");
        this.int_Saco = this.dialogSaco.componentInstance.int_Saco;
        this.str_Titulo_Saco = this.dialogSaco.componentInstance.str_Titulo_Saco;

        this.bol_AbrirSaco = !this.bol_AbrirSaco;

        let element = <HTMLElement>document.getElementById("btnBoxin_AbrirSaco");


        if(this.bol_AbrirSaco){
          element.innerText = "Cerrar Saco";
        }
        else{
          element.innerText = "Abrir Saco";
        }

      });
    }
    else
    {
      this.GuardarSaco("Cerrar") 
    }

    
   
  }



  GuardarSaco(evento : string) : void{
    

    this.str_Titulo_Saco = "";

    if(evento == "Crear") this.int_Saco = 0;

    let Saco : ClsSacoEstado = new ClsSacoEstado();

    Saco.Corte = this.str_Corte;
    Saco.Seccion = this.int_Seccion;
    Saco.Saco = this.int_Saco;
    Saco.Estado = evento;
    Saco.Login = this.LoginService.str_user;


    this.BundleBoningService.Saco(Saco).subscribe( s => {


      let _json = JSON.parse(s)

      if(_json["esError"] == 0){

        this.int_Saco = 0;
        this.str_Titulo_Saco = "";

        if(_json["count"] > 0)
        {

          this.int_Saco = 0;
          this.str_Titulo_Saco = "";

          if(evento != "Cerrar")
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

          this.BundleBoningService.change.emit("Close:Saco");

          
        }

      }
      else{

        this.dialogRef = this.dialog.open(DialogoComponent, {
          data: _json["msj"],
        });

      }
      

    });



  }

 
   //#endregion EVENTOS CREAR, CERRAR, ABIR SACO



   


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


    this.BundleBoningService.change.subscribe(s => {

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "Saco"){
        this.dialogSaco?.close();
      }
      
    });

  }




}
