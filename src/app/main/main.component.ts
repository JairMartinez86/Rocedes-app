import { Component, OnInit, HostListener, Input, ViewChild, ComponentFactoryResolver, ComponentRef, ViewContainerRef} from '@angular/core';

import { Esquema, Formulario } from 'src/app/main/class/Esquema/esquema';
import {LoginService,} from './Services/Usuario/login.service'; 
import { IUsuarioPerfil } from './class/Form/sis/Interface/i-UsuarioPerfil';
import { DialogoComponent } from './otro/dialogo/dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { OpenCloseDirective } from './Directive/open-close.directive';
import { UsuarioComponent } from './sis/usuario/usuario.component';
import { AccesoLinkComponent } from './sis/Acceso/acceso-link/acceso-link.component';
import { FactorTendidoComponent } from './inv/proceso-tendido/factor-tendido/factor-tendido.component';
import { TendidoTiempoComponent } from './inv/proceso-tendido/tendido-tiempo/tendido-tiempo.component';
import { FactorCorteComponent } from './inv/proceso-corte/factor-corte/factor-corte.component';
import { ReportBundleBoxingComponent } from './inv/bundle-boxing/reporte/report-bundle-boxing/report-bundle-boxing.component';
import { BundleBoxingSacoComponent } from './inv/bundle-boxing-saco/bundle-boxing-saco/bundle-boxing-saco.component';
import { BundleBoxingSerialComponent } from './inv/bundle-boxing-serial/bundle-boxing-serial/bundle-boxing-serial.component';
import { BundleBoxingComponent } from './inv/bundle-boxing/bundle-boxing.component';
import { BundleBoxingEnvioComponent } from './inv/bundle-boxing-envio/bundle-boxing-envio/bundle-boxing-envio.component';
import { FactorCorteTiempoComponent } from './inv/proceso-corte/factor-corte-tiempo/factor-corte-tiempo.component';
import { FactorFoleoComponent } from './inv/proceso-foleo/factor-foleo/factor-foleo.component';
import { FoleoTiempoComponent } from './inv/proceso-foleo/foleo-tiempo/foleo-tiempo.component';
import { FlujoCorteComponent } from './inv/flujo/flujo-corte/flujo-corte.component';


let ELEMENT_DATA_PERFIL_USUARIO: IUsuarioPerfil[] = [];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
 // template: `<app-descargue></app-descargue>`,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild (OpenCloseDirective) public dinamycHost: OpenCloseDirective = {} as OpenCloseDirective;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef | undefined;
  
  private lstEsquema :  Esquema[] = [];
  Esquema !:Esquema; 
  
  public NomUsuario : string = "";
  searchDrop = false;
 
  private Index : number = 0;



 // element!: HTMLElement;




  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {
    if (!this.href || this.href == '#' || (this.href && this.href.length === 0)) {
      var element = <HTMLElement>event.target;


      if(element.tagName  == "A" && element.getAttribute("href") == "#"){
        this.AbrirForm(element.id);   
      }  
      

      event.preventDefault();
    }
  }




  

 
  constructor(private loginserv : LoginService,  private dialog : MatDialog,
    private componentFactoryResolver:ComponentFactoryResolver) {
    

    this.loginserv.VerificarSession()
  
    let _Esquema : Esquema;

    _Esquema = new Esquema("SIS", "Configuración", false, new Formulario("LinkUsuario", "Usuario", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("SIS", "Configuración", false, new Formulario("LinkUsuarioPerfil", "Perfil", false));
    this.lstEsquema.push(_Esquema);
  



    
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxing", "Bundle Boxing", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkReportBundleBoxing", "Reporte Bundle Boxing", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxingSerial", "Seriales", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxingEnvio", "Envio", false));
    this.lstEsquema.push(_Esquema);



    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoTendidoFactor", "Factores de Tendido", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoTendidoCapaSencilla", "Capa Sencilla", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoTendidoCapaDoble", "Capa Doble", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoTendidoCapaManual", "Capa Manual", false));
    this.lstEsquema.push(_Esquema);


    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoCorteFactor", "Factores de Corte", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoCorteFactorTiempo", "Tiempo de Corte", false));
    this.lstEsquema.push(_Esquema);


    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoFoleoFactor", "Tiempo de Foleo", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoFoleoCapaSencilla", "Capa Sencilla", false));
    this.lstEsquema.push(_Esquema);
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkProcesoFoleoCapaDoble", "Capa Doble", false));
    this.lstEsquema.push(_Esquema);
    

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkFlujoCorte", "Flujo de Corte", false));
    this.lstEsquema.push(_Esquema);
    
    
    

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkOtro", "Otro", false));
    this.lstEsquema.push(_Esquema);
  
    

    this.Esquema = _Esquema;
    this.Esquema._Esquema = "";
    this.Esquema._Activo = false;
    this.Esquema._Nombre = "";


  }



  AbrirForm(_Id : string)
  {

    let component = null;

    if(_Id == "") return;

    let a = document.getElementsByTagName('a');
    Array.from(a).forEach((element) => {
      element?.classList.remove("active");
  });



  document.getElementById(_Id)?.parentElement?.classList.remove("active");
  document.getElementById(_Id)?.classList.remove("active");


  if(this.Esquema._Esquema == "SIS")
  {
    if(_Id != "LinkUsuario"){

      if(this.Esquema._Nombre != "LinkUsuario")
      {
        this.dinamycHost.viewContainerRef!.clear();
      }
      

    }

    if(_Id != "LinkRegistrosUsuario"){
      
      if(this.Esquema._Nombre != "LinkRegistrosUsuario")
      {
        this.dinamycHost.viewContainerRef!.clear();
      }
      
    }



    if(_Id != "LinkUsuarioPerfil"){
      this.dinamycHost.viewContainerRef!.clear();

    }

  }


  if(this.Esquema._Esquema == "INV")
  {

    if(_Id != "LinkBundleBoxing" && _Id != "LinkBundleBoxingComplemento"){
      this.dinamycHost.viewContainerRef!.clear();
    }
    

    
    if(_Id != "LinkReportBundleBoxing"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkBundleBoxingSaco"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkBundleBoxingSerial"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkBundleBoxingEnvio"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoTendidoFactor"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoTendidoCapaSencilla"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoTendidoCapaDoble"){
      this.dinamycHost.viewContainerRef!.clear();
    }
    
    if(_Id != "LinkProcesoCorteFactor"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoCorteFactorTiempo"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoFoleoFactor"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoFoleoCapaSencilla"){
      this.dinamycHost.viewContainerRef!.clear();
    }

    if(_Id != "LinkProcesoFoleoCapaDoble"){
      this.dinamycHost.viewContainerRef!.clear();
    }


    if(_Id != "LinkFlujoCorte"){
      this.dinamycHost.viewContainerRef!.clear();
    }
    
  }
  

  this.Esquema.ActivarForm(_Id);



  let element!: HTMLElement;

    switch(this.Esquema._Esquema){

      case "SIS":
        switch(_Id)
        {
          case "LinkUsuario":
            /*if(this.loginserv.isOpen && this.loginserv.str_Form != "frmUsuario") this.dinamycHost.viewContainerRef.clear();


            if(this.dinamycHost.viewContainerRef.length == 0)
            {
              component = this.componentFactoryResolver.resolveComponentFactory(UsuarioComponent);
              let Usuario: ComponentRef<UsuarioComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              Usuario.instance.str_from = "frmUsuario";
            }*/

           
           //ABRIR COMPONENTE MAS DE UNA VEZ
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UsuarioComponent);
            const componentRef = this.container!.createComponent(componentFactory);
            this.Index++;
            componentRef.instance.IndexModulo = this.Index
            componentRef.instance.str_from = "frmUsuario";
           
          break;

          case "LinkUsuarioPerfil":

            if(this.dinamycHost.viewContainerRef.length == 0)
            {
              component = this.componentFactoryResolver.resolveComponentFactory(AccesoLinkComponent);
              let Acceso: ComponentRef<AccesoLinkComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              Acceso.instance.str_frm = "PerfilUsuario";
            }
          break;

          case "LinkRegistrosUsuario":

            if(this.loginserv.isOpen && this.loginserv.str_Form != "frmRegistros") this.dinamycHost.viewContainerRef.clear();

            if(this.dinamycHost.viewContainerRef.length == 0)
            {
              component = this.componentFactoryResolver.resolveComponentFactory(UsuarioComponent);
              let UsuarioRegistros: ComponentRef<UsuarioComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              UsuarioRegistros.instance.str_from = "frmRegistros";
            }

            

          break;

        }
        break;

   
      case "INV":
        switch(_Id)
        {

          case "LinkBundleBoxing":

            if(this.dinamycHost.viewContainerRef.length == 0)
            {
              component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingComponent);
              let BundleBoxing: ComponentRef<BundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              BundleBoxing.instance.AbirBundle();
            };
            break;

            case "LinkBundleBoxingComplemento":
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingComponent);
                let BundleComplemento: ComponentRef<BundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleComplemento.instance.AbirComplemento();
              }

              break;

            case "LinkReportBundleBoxing":

            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(ReportBundleBoxingComponent);
                let ReporBundle: ComponentRef<ReportBundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                ReporBundle.instance.str_from = "ReportBundleBoxing";
              }


              break;

            case "LinkBundleBoxingSaco":

              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingSacoComponent);
                let BundleSaco: ComponentRef<BundleBoxingSacoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleSaco.instance.str_from = "BundleBoxingSaco";
              }

              break;

            case "LinkBundleBoxingSerial":

            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingSerialComponent);
                let BundleSerial: ComponentRef<BundleBoxingSerialComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleSerial.instance.str_from = "BundleBoxingSerial";
              }

              break;

            case "LinkBundleBoxingEnvio":
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingEnvioComponent);
                let BundleEnvio: ComponentRef<BundleBoxingEnvioComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleEnvio.instance.str_from = "LinkBundleBoxingEnvio";
              }

              break;

            case "LinkProcesoTendidoFactor":

            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FactorTendidoComponent);
                let FactorTendido: ComponentRef<FactorTendidoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "factores";
              }

              break;

            case "LinkProcesoTendidoCapaSencilla":

            

              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaSencilla";
              }

              break;

            case "LinkProcesoTendidoCapaDoble":
              
            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaDoble";
              }

              break;

            case "LinkProcesoTendidoCapaManual":
              
            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaManual";
              }
  
              break;

            case "LinkProcesoCorteFactor":

            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FactorCorteComponent);
                let FactorCorte: ComponentRef<FactorCorteComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorCorte.instance.str_from = "LinkProcesoCorteFactor";
              }



              break;


            case "LinkProcesoCorteFactorTiempo":

            
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FactorCorteTiempoComponent);
                let FactorCorte: ComponentRef<FactorCorteTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              }
  
  
  
              break;


            case "LinkProcesoFoleoFactor":
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FactorFoleoComponent);
               let FactorFoleo: ComponentRef<FactorFoleoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               FactorFoleo.instance.str_from = "factores";
              }
              break;

            case "LinkProcesoFoleoCapaSencilla":
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FoleoTiempoComponent);
               let TiempoFole: ComponentRef<FoleoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               TiempoFole.instance.Link = "LinkProcesoFoleoCapaSencilla";
              }
              break;


            case "LinkProcesoFoleoCapaDoble":
              if(this.dinamycHost.viewContainerRef.length == 0)
              {
                component = this.componentFactoryResolver.resolveComponentFactory(FoleoTiempoComponent);
               let TiempoFole: ComponentRef<FoleoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               TiempoFole.instance.Link = "LinkProcesoFoleoCapaDoble";
              }
              break;


            case "LinkFlujoCorte":
                if(this.dinamycHost.viewContainerRef.length == 0)
                {
                  component = this.componentFactoryResolver.resolveComponentFactory(FlujoCorteComponent);
                 let TiempoFole: ComponentRef<FlujoCorteComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                 TiempoFole.instance.Link = "LinkFlujoCorte";
                 TiempoFole.instance.Open = true;
                }
                break;
            
                  
          case "LinkOtro":

          break;
        }
        break;
    }

    element = <HTMLElement>document.getElementById(_Id)?.parentElement?.parentElement?.parentElement;
    element.classList.add("active");
    document.getElementById(_Id)?.classList.add("active");
    

  }

  Salir()
  {
    this.loginserv.CerrarSession();
  }


  Modulo(m : string)
  {

    this.Esquema =  <Esquema>this.lstEsquema.find(x => x._Esquema == m);

    if(m == "SIS" ) this.Esquema._Nombre = "Configuración"


    if(m == "INV" ) this.Esquema._Nombre = "Inventario"
    
   
    this.dinamycHost.viewContainerRef!.clear();
    

    

    this.Perfiles();

  }

  mouseEnter(a : string)
  {
  /*  this.element = <HTMLElement>document.getElementById(a);
    this.element.setAttribute("style", 'background-color: #E2E2E2;');*/

    
  }

  mouseLeave(a : string)
  {
  /*  this.element = <HTMLElement>document.getElementById(a);
    this.element.setAttribute("class", 'nav-item');*/
  }

  Perfiles() : void
  {

    ELEMENT_DATA_PERFIL_USUARIO.splice(0 , ELEMENT_DATA_PERFIL_USUARIO.length)
    this.loginserv.BuscarAcceso().subscribe( s =>{
    
      let _json = JSON.parse(s);
      
      if(_json["esError"] == 0)
      {
        if(_json["count"] > 0)
        {


          _json["d"].forEach((j : IUsuarioPerfil) => {
            ELEMENT_DATA_PERFIL_USUARIO.push(j);
          });
        }
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

      this.Nodos(<Element>document.getElementById("Esquema"), true);
      this.Nodos(<Element>document.getElementById("NavControl"), false);

    });

  }


  Nodos(_element : Element, esEscquema : boolean) : void
  {


    for(var i = 0; i < _element.children.length; i++)
    {

      if(_element.children.length > 0)
      {
        this.Nodos(_element.children[i], esEscquema);

      }
    }


    if(_element.children.length <=1 && _element.id != "")
    {
    
      document.getElementById(_element.id)?.classList.add("NoVisible");

      if(esEscquema)
      {
        
        if(ELEMENT_DATA_PERFIL_USUARIO.findIndex( f => f.Esquema == _element.id) != -1)
        {
          document.getElementById(_element.id)?.classList.remove("NoVisible");
        }
      }
      else
      {

        
        if(ELEMENT_DATA_PERFIL_USUARIO.findIndex( f => f.Link == _element.id) != -1)
        {
          
          document.getElementById(_element.id)?.classList.remove("NoVisible");
        }

      }
     

      
    }
    


  }


  ngOnInit(): void {

  
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });

    if(this.loginserv.isLoguin) this.loginserv.TimeOut();

    this.loginserv.change.subscribe(s => {

      this.NomUsuario = this.loginserv.Nombre;

      this.Perfiles();
    });



  }



}
