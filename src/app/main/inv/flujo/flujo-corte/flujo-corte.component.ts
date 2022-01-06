import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { IFactorCorte } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte';
import { IFactorCorteDetalle } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte-Detalle';
import { IFactorFoleo } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Foleo';
import { IFactorTendido } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Tendido';
import { IFoleoDatos } from 'src/app/main/class/Form/Inv/Interface/i-Foleo-Datos';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { OpenCloseDirective } from 'src/app/main/Directive/open-close.directive';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { FlujoCorteService } from 'src/app/main/Services/inv/Flujo/flujo-corte.service';
import { FactorCorteService } from 'src/app/main/Services/inv/ProcesoCorte/factor-corte.service';
import { FactorCorteTiempoComponent } from '../../proceso-corte/factor-corte-tiempo/factor-corte-tiempo.component';
import { FoleoTiempoComponent } from '../../proceso-foleo/foleo-tiempo/foleo-tiempo.component';
import { TendidoTiempoComponent } from '../../proceso-tendido/tendido-tiempo/tendido-tiempo.component';

export interface IFlujoCorte {

  Operacion : string;
  Descripcion : string;
  Manual : any;
  Doble: any;
  Sencilla: any;
}

export interface IFlujoCorte_Excel {
  Index : number;
  Operacion : string;
  Descripcion : string;
  C : string;
  D : String;
  Machine : string;
  Rate : any;
  Sam: any;
  Pago: any;
}

let ELEMENT_DATA_FLUJO : IFlujoCorte[] = []; 

let ELEMENT_DATA_FLUJO_EXCEL : IFlujoCorte_Excel[] = [
  {Index : 0, Operacion : "TENDIDO", Descripcion : "TENDIDO MANUAL", C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null},
  {Index : 1, Operacion : "TENDIDO", Descripcion : "TENDIDO DOBLE",  C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null},
  {Index : 2, Operacion : "TENDIDO", Descripcion : "TENDIDO SENCILLO",  C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null},

  {Index : 3, Operacion : "CORTE", Descripcion : "CORTAR PIEZAS",  C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null},

  {Index : 4, Operacion : "FOLEO", Descripcion : "FOLEO CAPA SENCILLA",  C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null},
  {Index : 5, Operacion : "FOLEO", Descripcion : "FOLEO CAPA DOBLE",  C: "", D : "", Machine : "MACHINE", Rate : null, Sam : null , Pago : null}


]; 


let ELEMENT_DATA_TIEMPO : IFactorTendido[] = [];
let ELEMENT_DATA_FACTOR_FOLEO : IFactorFoleo[] = [];

@Component({
  selector: 'app-flujo-corte',
  templateUrl: './flujo-corte.component.html',
  styleUrls: ['./flujo-corte.component.css']
})
export class FlujoCorteComponent implements OnInit {

  @ViewChild (OpenCloseDirective) public dinamycHost: OpenCloseDirective = {} as OpenCloseDirective;
  @ViewChild('ContainerTiempo', { read: ViewContainerRef }) container: ViewContainerRef | undefined;

  public val = new Validacion();

  public FechaInicio : Date | undefined;
  public FechaFinal : Date | undefined;
  public num_Minutos : number = 0;
  public num_Horas : number = 0;
  public DatosFoleo : IFoleoDatos = {} as IFoleoDatos;

  public Open : boolean = false;

  public Link : string = "";
  public str_Titulo_Tiempo : string = "";
  public str_Estilo : string = "";
  public str_Componenete : string = "";
  optionSeleccionDatos : IFoleoDatos[] = [];


  displayedColumns: string[] = ["Operacion", "Descripcion",  "Manual", "Doble", "Sencilla"];
  spanningColumns = ["Operacion"];
  dataSourceFlujoCorte = new MatTableDataSource(ELEMENT_DATA_FLUJO);
  clickedRows = new Set<IFoleoDatos>();
  spans : any[] = [];


  constructor(private dialog : MatDialog,  private _FactorCorteService : FactorCorteService,
    private componentFactoryResolver:ComponentFactoryResolver, private _FlujoCorteService : FlujoCorteService) { 

    this.val.add("txt_flujo_Estilo", "1", "LEN>", "0");
    this.val.add("txt_flujo_Corte", "1", "LEN>", "0");
    this.val.add("txt_flujo_Seccion", "1", "LEN>=", "0");
    this.val.add("txt_flujo_Jornada", "1", "NUM>", "0");
    this.val.add("txt_flujo_Pago", "1", "NUM>", "0");
    
    
  }


  cacheSpan(key : any, accessor : any) {
    for (let i = 0; i < ELEMENT_DATA_FLUJO.length;) {
      let currentValue = accessor(ELEMENT_DATA_FLUJO[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < ELEMENT_DATA_FLUJO.length; j++) {        
        if (currentValue != accessor(ELEMENT_DATA_FLUJO[j])) {
          break;
        }

        count++;
      } 

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col : any, index : number) {
    return this.spans[index] && this.spans[index][col];
  }


  private Limpiar() : void
  {
    this.str_Estilo = "";
    this.str_Componenete = "";
    this.num_Horas = 0;
    this.num_Minutos = 0;
    this.FechaInicio = undefined;
    this.FechaFinal = undefined;
   
    this.val.ValForm.reset();


    this.val.ValForm.get("txt_flujo_Estilo")?.setValue("");
    this.val.ValForm.get("txt_flujo_Corte")?.setValue("");
    this.val.ValForm.get("txt_flujo_Seccion")?.setValue("");
    this.val.ValForm.get("txt_flujo_Jornada")?.setValue("660");
    this.val.ValForm.get("txt_flujo_Pago")?.setValue("500");

    ELEMENT_DATA_FLUJO.splice(0, ELEMENT_DATA_FLUJO.length);
    
  }


  public Cerrar() : void
  {
    this.Open = false;
  }




  onKeyEnter(event: any){
    

    let _input : string = event.target.id;
    

    if(event.target.value == "") {
      document?.getElementById(_input)?.focus();
      event.preventDefault();
      return;
    }


    let _Opcion : any = this.val.ValForm.get("txt_flujo_Estilo")?.value;

    if( typeof(_Opcion) == 'string' ) {
  
      _Opcion = this.optionSeleccion.filter( f => f.Componente == this.val.ValForm.get("txt_flujo_Estilo")?.value)[0]
  
      if(_Opcion == null){
        this.val.ValForm.get("txt_flujo_Estilo")?.setValue("");
        return;
      }
      
    }


    this.str_Estilo = _Opcion.Estilo;
    if(String(_Opcion.Estilo).split("-").length > 0)  this.str_Estilo = String(_Opcion.Estilo).split("-")[0];

    this.str_Componenete = String(_Opcion.Componente).split(" ")[0];

    
  this.LlenarTabla();
  this.dataSourceFlujoCorte = new MatTableDataSource(ELEMENT_DATA_FLUJO); 
  this.cacheSpan("Operacion", (d : any) => d.Operacion);


    switch(_input){

      case "txt_flujo_Estilo":
        document?.getElementById("txt_flujo_Corte")?.focus();
        break;

      case "txt_flujo_Corte":
        document?.getElementById("txt_flujo_Seccion")?.focus();
      break;

      case "txt_flujo_Seccion":
        document?.getElementById("txt_flujo_Jornada")?.focus();
      break;

      case "txt_flujo_Jornada":
          document?.getElementById("txt_flujo_Pago")?.focus();
      break;


    }
    
    event.preventDefault();

  }



  
  
  //#region AUTO COMPLETADO COMPONENTE
	
  optionSeleccion : IFactorCorteDetalle[] = [];
  filteredOptions!: Observable<IFactorCorteDetalle[]>;

  txt_flujo_Estilo_onSearchChange(event : any) :void{

  this.optionSeleccion.splice(0, this.optionSeleccion.length);

  let value : string = event.target.value;


  if(value.length <= 2) return;



  this._FactorCorteService.GetAuto(value).subscribe( s => {
    let _json = JSON.parse(s);


    if(_json["esError"] == 0){


      if(_json["count"] > 0){
        
        _json["d"].forEach((j : IFactorCorteDetalle) => {
          this.optionSeleccion.push(j);
        });

        this.filteredOptions = this.val.ValForm.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.Componente)),
          map(Componente => (Componente ? this._FiltroSeleccion(Componente) : this.optionSeleccion.slice())),
        );
       
      }
     
    }else{
      this.dialog.open(DialogoComponent, {
        data: _json["msj"]
      })



    }

  });



}





MostrarSelec(Registro: IFactorCorteDetalle): string {
  if(Registro == null) return "";
  return Registro.Componente;
}

private _FiltroSeleccion(Componente: string): IFactorCorteDetalle[] {
  const filterValue = Componente.toLowerCase();
  
  return this.optionSeleccion.filter(option => option.Componente.toLowerCase().startsWith(filterValue));
}






//#endregion AUTO COMPLETADO COMPONENTE


Calcular() : void
{
  if(this.val.ValForm.invalid) return;

  
  let _Opcion : any = this.val.ValForm.get("txt_flujo_Estilo")?.value;

  if( typeof(_Opcion) == 'string' ) {

    _Opcion = this.optionSeleccion.filter( f => f.Componente == this.val.ValForm.get("txt_flujo_Estilo")?.value)[0]

    if(_Opcion == null){
      this.val.ValForm.get("txt_flujo_Estilo")?.setValue("");
      return;
    }
    
  }

  this.str_Estilo = _Opcion.Estilo;
  if(String(_Opcion.Estilo).split("-").length > 0)  this.str_Estilo = String(_Opcion.Estilo).split("-")[0];

  this.str_Componenete = String(_Opcion.Componente).split(" ")[0];


    
  this.LlenarTabla();
  this.dataSourceFlujoCorte = new MatTableDataSource(ELEMENT_DATA_FLUJO); 
  this.cacheSpan("Operacion", (d : any) => d.Operacion);

  ELEMENT_DATA_TIEMPO.splice(0, ELEMENT_DATA_TIEMPO.length);
  ELEMENT_DATA_FACTOR_FOLEO.splice(0, ELEMENT_DATA_FACTOR_FOLEO.length);
  this.optionSeleccionDatos.splice(0, this.optionSeleccionDatos.length);

  this._FlujoCorteService.Get(_Opcion.IdFactorDetalleCorte, this.str_Estilo).subscribe( s =>{
  
    let _json = JSON.parse(s);


    if(_json["esError"] == 0)
    {
      if(_json["count"] > 0)
      {

  
        _json["d"][0].forEach((j : IFactorTendido) => {
          ELEMENT_DATA_TIEMPO.push(j);
        });

    
        _json["d"][3].forEach((j : IFactorFoleo) => {
          ELEMENT_DATA_FACTOR_FOLEO.push(j);
        });

        _json["d"][4].forEach((j : IFoleoDatos) => {
          this.optionSeleccionDatos.push(j);
        });



        this.CalcularMinutos(_json["d"][1], _json["d"][2]);

       


      }
    }
    else
    {
      this.dialog.open(DialogoComponent, {
        data : _json["msj"]
      })
    }


  });

}
CalcularMinutos(DatosCorte : IFactorCorte, DatosCorteDetalle : IFactorCorteDetalle) : void
{


  let component = null;
  this.dinamycHost.viewContainerRef!.clear();


  component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
  let Tendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
  Tendido.instance.dataSourceFactorTendidoTiempo = new MatTableDataSource(ELEMENT_DATA_TIEMPO);


  component = this.componentFactoryResolver.resolveComponentFactory(FactorCorteTiempoComponent);
  let Corte: ComponentRef<FactorCorteTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
  Corte.instance.val.ValForm.get("txt_Factor_Tiempo_Componente")?.setValue(this.val.ValForm.get("txt_flujo_Estilo")?.value);
 
  component = this.componentFactoryResolver.resolveComponentFactory(FoleoTiempoComponent);
  let Foleo: ComponentRef<FoleoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
  Foleo.instance.val.ValForm.get("txt_foleo_Estilo")?.setValue(this.str_Estilo);
  Foleo.instance.optionSeleccion = this.optionSeleccionDatos;
  Foleo.instance.dataSourceFactorFoleo = new MatTableDataSource(ELEMENT_DATA_FACTOR_FOLEO);



  let Capas : number = 0;
  let LongMarker : number = 0;
  let Rollos : number = 0;
  let Bultos : number = 0;
  let Personas : number = 0;
  let CantPersonaPartePequeña : number = 0;
  let CantPersonaParteGrande : number = 0;
  let SamManual : number = 0;
  let SamDoble : number = 0;
  let SamSencilla : number = 0;


  //MANUAL
  let Fila : IFlujoCorte[] = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "TENDIDO");

  Tendido.instance.str_Capa = "Manual"
  if(Fila[0].Manual != null) if(!Number.isNaN(Fila[0].Manual)) Capas = Fila[0].Manual;
  if(Fila[1].Manual != null) if(!Number.isNaN(Fila[1].Manual)) LongMarker = Fila[1].Manual;
  if(Fila[2].Manual != null) if(!Number.isNaN(Fila[2].Manual)) Rollos = Fila[2].Manual;

  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Capas")?.setValue(Capas);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Rollos")?.setValue(Rollos);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Yardas")?.setValue(LongMarker);
  ELEMENT_DATA_FLUJO_EXCEL[0].Sam = Tendido.instance.calcularMinutos();


  //DOBLE

  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "TENDIDO");
  Tendido.instance.str_Capa = "Doble"
  if(Fila[0].Doble != null) if(!Number.isNaN(Fila[0].Doble)) Capas = Fila[0].Doble;
  if(Fila[1].Doble != null) if(!Number.isNaN(Fila[1].Doble)) LongMarker = Fila[1].Doble;
  if(Fila[2].Doble != null) if(!Number.isNaN(Fila[2].Doble)) Rollos = Fila[2].Doble;

  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Capas")?.setValue(Capas);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Rollos")?.setValue(Rollos);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Yardas")?.setValue(LongMarker);
  ELEMENT_DATA_FLUJO_EXCEL[1].Sam = Tendido.instance.calcularMinutos();
  

  
  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "CORTE");
  if(Fila[0].Doble != null) if(!Number.isNaN(Fila[0].Doble)) Bultos = Fila[0].Doble;
  if(Fila[1].Doble != null) if(!Number.isNaN(Fila[1].Doble)) Personas = Fila[1].Doble;
  ELEMENT_DATA_FLUJO_EXCEL[3].Sam = Corte.instance.GetDetalle(DatosCorte, DatosCorteDetalle, Bultos, LongMarker, Personas);


  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "FOLEO");
  if(Fila[0].Doble != null) if(!Number.isNaN(Fila[0].Doble)) CantPersonaPartePequeña = Fila[0].Doble;
  if(Fila[1].Doble != null) if(!Number.isNaN(Fila[1].Doble)) CantPersonaParteGrande = Fila[1].Doble;
  Foleo.instance.str_Capa = "Doble"
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Bulto")?.setValue(Bultos);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Capas")?.setValue(Capas);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Personas_Pieza_Grande")?.setValue(CantPersonaParteGrande);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Personas_Pieza_Pequeña")?.setValue(CantPersonaPartePequeña);
  ELEMENT_DATA_FLUJO_EXCEL[4].Sam = Foleo.instance.calcularMinutos();



  //SENCILLA
  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "TENDIDO");
  Tendido.instance.str_Capa = "Sencilla"
  if(Fila[0].Sencilla != null) if(!Number.isNaN(Fila[0].Sencilla)) Capas = Fila[0].Sencilla;
  if(Fila[1].Sencilla != null) if(!Number.isNaN(Fila[1].Sencilla)) LongMarker = Fila[1].Sencilla;
  if(Fila[2].Sencilla != null) if(!Number.isNaN(Fila[2].Sencilla)) Rollos = Fila[2].Sencilla;

  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Capas")?.setValue(Capas);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Rollos")?.setValue(Rollos);
  Tendido.instance.val.ValForm.get("txt_Tendido_Cantidad_Yardas")?.setValue(LongMarker);
  ELEMENT_DATA_FLUJO_EXCEL[2].Sam = Tendido.instance.calcularMinutos();


  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "CORTE");
  if(Fila[0].Sencilla != null) if(!Number.isNaN(Fila[0].Sencilla)) Bultos = Fila[0].Sencilla;
  if(Fila[1].Sencilla != null) if(!Number.isNaN(Fila[1].Sencilla)) Personas = Fila[1].Sencilla;
  ELEMENT_DATA_FLUJO_EXCEL[3].Sam = Corte.instance.GetDetalle(DatosCorte, DatosCorteDetalle, Bultos, LongMarker, Personas) / Personas;


  Fila = ELEMENT_DATA_FLUJO.filter(x => x.Operacion == "FOLEO");
  if(Fila[0].Sencilla != null) if(!Number.isNaN(Fila[0].Sencilla)) CantPersonaPartePequeña = Fila[0].Sencilla;
  if(Fila[1].Sencilla != null) if(!Number.isNaN(Fila[1].Sencilla)) CantPersonaParteGrande = Fila[1].Sencilla;
  Foleo.instance.str_Capa = "Sencilla"
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Bulto")?.setValue(Bultos);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Capas")?.setValue(Capas);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Personas_Pieza_Grande")?.setValue(CantPersonaParteGrande);
  Foleo.instance.val.ValForm.get("txt_Foleo_Cant_Personas_Pieza_Pequeña")?.setValue(CantPersonaPartePequeña);
  ELEMENT_DATA_FLUJO_EXCEL[5].Sam = Foleo.instance.calcularMinutos();


  console.log(ELEMENT_DATA_FLUJO_EXCEL)

}


LlenarTabla()
{

  if(ELEMENT_DATA_FLUJO.findIndex(f => f.Operacion == "TENDIDO") == -1)
  {
    ELEMENT_DATA_FLUJO.push({Operacion : "TENDIDO", Descripcion : "CANTIDAD DE CAPAS", Manual : null, Doble : null , Sencilla : null});
    ELEMENT_DATA_FLUJO.push({Operacion : "TENDIDO", Descripcion : "LONGITUD DE MARKERS", Manual : null, Doble : null , Sencilla : null});
    ELEMENT_DATA_FLUJO.push({Operacion : "TENDIDO", Descripcion : "CANTIDAD DE ROLLOS UTILIZADOS", Manual : null, Doble : null , Sencilla : null});
  }


  
  if(ELEMENT_DATA_FLUJO.findIndex(f => f.Operacion == "CORTE") == -1)
  {
    ELEMENT_DATA_FLUJO.push({Operacion : "CORTE", Descripcion : "BULTOS", Manual : null, Doble : null , Sencilla : null});
    ELEMENT_DATA_FLUJO.push({Operacion : "CORTE", Descripcion : "PERSONAS", Manual : null, Doble : null , Sencilla : null});
  }
  

  if(ELEMENT_DATA_FLUJO.findIndex(f => f.Operacion == "FOLEO") == -1)
  {
    ELEMENT_DATA_FLUJO.push({Operacion : "FOLEO", Descripcion : "CANTIDAD DE PERSONAS EN PARTES PEQUEÑAS", Manual : null, Doble : null , Sencilla : null});
    ELEMENT_DATA_FLUJO.push({Operacion : "FOLEO", Descripcion : "CANTIDAD DE PERSONAS EN PARTES GRANDES", Manual : null, Doble : null , Sencilla : null});
  }

  if(this.str_Componenete.toUpperCase() == "PKT")
  {
    ELEMENT_DATA_FLUJO.splice(4, ELEMENT_DATA_FLUJO.length);
  }

}
exportar() : void
{

}

    
  ngOnInit(): void {
    this.Limpiar();
    this.Open = true;

  }

}