import { Component, OnInit, HostListener, Input, ViewChild, ComponentFactoryResolver, ComponentRef, ViewContainerRef} from '@angular/core';

import { Esquema, Formulario } from 'src/app/main/shared/class/Esquema/esquema';
import {LoginService,} from './sis/service/login.service'; 
import { IUsuarioPerfil } from './sis/interface/i-UsuarioPerfil';
import { DialogoComponent } from './shared/dialogo/dialogo.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioComponent } from './sis/components/usuario/usuario.component';
import { AccesoLinkComponent } from './sis/components/acceso-link/acceso-link.component';
import { FactorTendidoComponent } from './Prm/components/tendido/factor-tendido/factor-tendido.component';
import { TendidoTiempoComponent } from './Prm/components/tendido/tendido-tiempo/tendido-tiempo.component';
import { FactorCorteComponent } from './Prm/components/corte/factor-corte/factor-corte.component';
import { ReportBundleBoxingComponent } from './inv/bundle-boxing/components/report-bundle-boxing/report-bundle-boxing.component';
import { BundleBoxingSacoComponent } from './inv/bundle-boxing/components/bundle-boxing-saco/bundle-boxing-saco.component';
import { BundleBoxingSerialComponent } from './inv/bundle-boxing/components/bundle-boxing-serial/bundle-boxing-serial.component';
import { BundleBoxingComponent } from './inv/bundle-boxing/components/bundle-boxing.component';
import { BundleBoxingEnvioComponent } from './inv/bundle-boxing/components/bundle-boxing-envio/bundle-boxing-envio.component';
import { FactorCorteTiempoComponent } from './Prm/components/corte/factor-corte-tiempo/factor-corte-tiempo.component';
import { FactorFoleoComponent } from './Prm/components/foleo/factor-foleo/factor-foleo.component';
import { FoleoTiempoComponent } from './Prm/components/foleo/foleo-tiempo/foleo-tiempo.component';
import { FlujoCorteComponent } from './Prm/components/flujo/flujo-corte.component';
import { CodigoGsdComponent } from './Prm/components/operacion/datos-gsd/codigo-gsd.component';
import { PartesComponent } from './Prm/components/operacion/partes/partes.component';
import { TiposTelaComponent } from './Prm/components/tipos-tela/tipos-tela.component';
import { SewingComponent } from './Prm/components/operacion/sewing/sewing.component';
import { SewingAccuracyComponent } from './Prm/components/operacion/sewing-accuracy/sewing-accuracy.component';
import { ProductoComponent } from './inv/producto/producto.component';
import { FabricOunceComponent } from './Prm/components/operacion/fabric-ounce/fabric-ounce.component';
import { DataMachineComponent } from './Prm/components/operacion/data-machine/data-machine.component';
import { MethodAnalysisComponent } from './Prm/components/operacion/method-analysis/method-analysis.component';
import { MatrizOperacionComponent } from './Prm/components/operacion/matriz-operacion/matriz-operacion.component';
import { ClienteComponent } from './cxc/cliente/components/cliente.component';
import { OpenCloseDirective } from './shared/Directive/open-close.directive';
import { PlaningComponent } from './Pln/components/planing/planing.component';
import { UploadExcelComponent } from './shared/upload-excel/upload-excel.component';

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
  
  Esquema : Esquema = new Esquema(); 
  public str_Modulo : string = "";
  public str_Esquema : string = "";
  
  public NomUsuario : string = "";
  searchDrop = false;
 
  private Index : number = 0;
  private dialogOpen : string = "";



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
  
    this.Esquema.add("HOM", "", "", false);


    this.Esquema.add("SIS", "LinkUsuario", "Usuario", false);
    this.Esquema.add("SIS", "LinkUsuarioPerfil", "Perfil", false);

  


    this.Esquema.add("PRM", "LinkProcesoTendidoFactor", "Spreading Factors", false);
    this.Esquema.add("PRM", "LinkProcesoTendidoCapaSencilla", "Single Ply", false);
    this.Esquema.add("PRM", "LinkProcesoTendidoCapaDoble", "Double Ply", false);
    this.Esquema.add("PRM", "LinkProcesoTendidoCapaManual", "Manual Spreading", false);



    this.Esquema.add("PRM", "LinkProcesoCorteFactor", "Cutting Factors", false);
    this.Esquema.add("PRM", "LinkProcesoCorteFactorTiempo", "Cutting Time", false);


    this.Esquema.add("PRM", "LinkProcesoFoleoFactor", "Layer Marking Factors", false);
    this.Esquema.add("PRM", "LinkProcesoFoleoCapaSencilla", "Single Ply", false);
    this.Esquema.add("PRM", "LinkProcesoFoleoCapaDoble", "Double Ply", false);
    



    this.Esquema.add("PRM", "LinkFlujoCorte", "Cutting Flow", false);



    this.Esquema.add("PRM", "Link-Operaciones-cliente", "Customers", false);
    this.Esquema.add("PRM", "Link-Operaciones-producto", "Product Catalog", false);
    this.Esquema.add("PRM", "Link-Operaciones-codigo-gsd", "Manufacturing Codes", false);
    this.Esquema.add("PRM", "Link-Operaciones-tela", "Type of Fabic", false);
    this.Esquema.add("PRM", "Link-Operaciones-partes", "Sewing Garment", false);
    this.Esquema.add("PRM", "Link-Operaciones-sewing", "Sewing Considerations", false);
    this.Esquema.add("PRM", "Link-Operaciones-sewing-accuracy", "Sewing Stop Accuracy", false);
    this.Esquema.add("PRM", "Link-Operaciones-Development-Methos-Analisys", "Method Analysis", false);



    this.Esquema.add("PRM", "Link-Operaciones-Development-Methos-Analisys", "Method Analysis", false);


    this.Esquema.add("PRM", "Link-Operaciones-Matriz-Data", "Operation Matrix Data", false);

    
    this.Esquema.add("INV", "LinkBundleBoxing", "Bundle Boxing", false);
    this.Esquema.add("INV", "LinkReportBundleBoxing", "Reporte Bundle Boxing", false);
    this.Esquema.add("INV", "LinkBundleBoxingSerial", "Seriales", false);
    this.Esquema.add("INV", "LinkBundleBoxingEnvio", "Envio", false);



    this.Esquema.add("PLN","Link-Pln-datos-planing", "Datos Planing", false);

    this.Esquema.add("PLN", "Link-Planing", "Planing", false);

  


  }



  AbrirForm(_Id : string)
  {

    let component = null;    
    let index = 0;       

    if(_Id == "") return;

    let a = document.getElementsByTagName('a');
    Array.from(a).forEach((element) => {
      element?.classList.remove("active");
  });



  document.getElementById(_Id)?.parentElement?.classList.remove("active");
  document.getElementById(_Id)?.classList.remove("active");


  //-----------------------------CONFIGURACION------------------------------------------------------------------------------------------------------------->
/*
  if(_Id != "LinkUsuario"){

    if(this.Esquema._Id != "LinkUsuario")
    {
      this.dinamycHost.viewContainerRef!.clear();
    }
  
  }

  
  if(_Id != "LinkRegistrosUsuario"){
    
    if(this.Esquema._Id != "LinkRegistrosUsuario")
    {
      this.dinamycHost.viewContainerRef!.clear();
    }
    
  }



  if(_Id != "LinkUsuarioPerfil"){
    this.dinamycHost.viewContainerRef!.clear();

  }


  //-----------------------------INVENTARIO---------------------------------------------------------------------------------------------------------------->


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



  //-----------------------------PREMIUM------------------------------------------------------------------------------------------------------------------->

  
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


  if(_Id != "Link-Operaciones-cliente"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-codigo-gsd"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-tela"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-partes"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-sewing"){
    this.dinamycHost.viewContainerRef!.clear();
  }


  if(_Id != "Link-Operaciones-sewing-accuracy"){
    this.dinamycHost.viewContainerRef!.clear();
  }


  if(_Id != "Link-Operaciones-producto"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-ounce"){
    this.dinamycHost.viewContainerRef!.clear();
  }


  if(_Id != "Link-Operaciones-data-machine"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-Development-Methos-Analisys"){
    this.dinamycHost.viewContainerRef!.clear();
  }

  if(_Id != "Link-Operaciones-Matriz-Data"){
    this.dinamycHost.viewContainerRef!.clear();
  }
  
 



  //-----------------------------PLANING------------------------------------------------------------------------------------------------------------------->
  

  if(_Id != "Link-Pln-datos-planing"){
    this.dialogOpen = ""
    this.dialog.closeAll();
  }

  if(_Id != "Link-Planing"){
    this.dinamycHost.viewContainerRef!.clear();
  }
  */


  let element!: HTMLElement;

    switch(this.str_Esquema){

      case "SIS":
        switch(_Id)
        {
          case "LinkUsuario":
            if(this.loginserv.isOpen && this.loginserv.str_Form != "frmUsuario") this.dinamycHost.viewContainerRef.clear();


             if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(UsuarioComponent);
              let Usuario: ComponentRef<UsuarioComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              Usuario.instance.str_from = "frmUsuario";
            }

           
           //ABRIR COMPONENTE MAS DE UNA VEZ
           /* const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UsuarioComponent);
            const componentRef = this.container!.createComponent(componentFactory);
            this.Index++;
            componentRef.instance.IndexModulo = this.Index
            componentRef.instance.str_from = "frmUsuario";*/
           
          break;

          case "LinkUsuarioPerfil":

            if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(AccesoLinkComponent);
              let Acceso: ComponentRef<AccesoLinkComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              Acceso.instance.str_frm = "PerfilUsuario";
            }
          break;

          case "LinkRegistrosUsuario":

            if(this.loginserv.isOpen && this.loginserv.str_Form != "frmRegistros") this.dinamycHost.viewContainerRef.clear();

            if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

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

            if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingComponent);
              let BundleBoxing: ComponentRef<BundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              BundleBoxing.instance.AbirBundle();
            };
            break;

            case "LinkBundleBoxingComplemento":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingComponent);
                let BundleComplemento: ComponentRef<BundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleComplemento.instance.AbirComplemento();
              }

              break;

            case "LinkReportBundleBoxing":

            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(ReportBundleBoxingComponent);
                let ReporBundle: ComponentRef<ReportBundleBoxingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                ReporBundle.instance.str_from = "ReportBundleBoxing";
              }


              break;

            case "LinkBundleBoxingSaco":

               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingSacoComponent);
                let BundleSaco: ComponentRef<BundleBoxingSacoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleSaco.instance.str_from = "BundleBoxingSaco";
              }

              break;

            case "LinkBundleBoxingSerial":

            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingSerialComponent);
                let BundleSerial: ComponentRef<BundleBoxingSerialComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleSerial.instance.str_from = "BundleBoxingSerial";
              }

              break;

            case "LinkBundleBoxingEnvio":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(BundleBoxingEnvioComponent);
                let BundleEnvio: ComponentRef<BundleBoxingEnvioComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                BundleEnvio.instance.str_from = "LinkBundleBoxingEnvio";
              }

              break;
        }
      break;

   
      case "PRM":
        switch(_Id)
        {

            case "LinkProcesoTendidoFactor":

            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FactorTendidoComponent);
                let FactorTendido: ComponentRef<FactorTendidoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "factores";
              }

              break;

            case "LinkProcesoTendidoCapaSencilla":

            

               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaSencilla";
              }

              break;

            case "LinkProcesoTendidoCapaDoble":
              
            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();
                
                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaDoble";
              }

              break;

            case "LinkProcesoTendidoCapaManual":
              
            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(TendidoTiempoComponent);
                let FactorTendido: ComponentRef<TendidoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorTendido.instance.str_from = "LinkProcesoTendidoCapaManual";
              }
  
              break;

            case "LinkProcesoCorteFactor":

            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FactorCorteComponent);
                let FactorCorte: ComponentRef<FactorCorteComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorCorte.instance.str_from = "LinkProcesoCorteFactor";
              }



              break;


            case "LinkProcesoCorteFactorTiempo":

            
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FactorCorteTiempoComponent);
                let FactorCorte: ComponentRef<FactorCorteTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                FactorCorte.instance.Open = true;
              }
  
  
  
              break;


            case "LinkProcesoFoleoFactor":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FactorFoleoComponent);
               let FactorFoleo: ComponentRef<FactorFoleoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               FactorFoleo.instance.str_from = "factores";
              }
              break;

            case "LinkProcesoFoleoCapaSencilla":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FoleoTiempoComponent);
               let TiempoFole: ComponentRef<FoleoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               TiempoFole.instance.Link = "LinkProcesoFoleoCapaSencilla";
               TiempoFole.instance.Open = true;
              }
              break;


            case "LinkProcesoFoleoCapaDoble":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(FoleoTiempoComponent);
               let TiempoFole: ComponentRef<FoleoTiempoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
               TiempoFole.instance.Link = "LinkProcesoFoleoCapaDoble";
               TiempoFole.instance.Open = true;
              }
              break;


            case "LinkFlujoCorte":
                 if(this.Esquema._Id != _Id)
                {
                  this.dinamycHost.viewContainerRef!.clear();

                  component = this.componentFactoryResolver.resolveComponentFactory(FlujoCorteComponent);
                 let TiempoFole: ComponentRef<FlujoCorteComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                 TiempoFole.instance.Link = "LinkFlujoCorte";
                 TiempoFole.instance.Open = true;
                }
                break;

            case "Link-Operaciones-cliente":
                 if(this.Esquema._Id != _Id)
                {
                  this.dinamycHost.viewContainerRef!.clear();

                  component = this.componentFactoryResolver.resolveComponentFactory(ClienteComponent);
                  let OperCliente: ComponentRef<ClienteComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                  OperCliente.instance.Link = "Link-Operaciones-cliente";
                  OperCliente.instance.Open = true;
                }
                break;


            case "Link-Operaciones-codigo-gsd":
                 if(this.Esquema._Id != _Id)
                {
                  this.dinamycHost.viewContainerRef!.clear();

                  component = this.componentFactoryResolver.resolveComponentFactory(CodigoGsdComponent);
                 let CodigoGSD: ComponentRef<CodigoGsdComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                 CodigoGSD.instance.Link = "Link-Operaciones-codigo-gsd";
                 CodigoGSD.instance.Open = true;
                }
                break;

            case "Link-Operaciones-tela":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(TiposTelaComponent);
                let Partes: ComponentRef<TiposTelaComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                Partes.instance.Link = "Link-Operaciones-tela";
                Partes.instance.Open = true;
              }
              break;

            case "Link-Operaciones-partes":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(PartesComponent);
                let Partes: ComponentRef<PartesComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                Partes.instance.Link = "Link-Operaciones-partes";
                Partes.instance.Open = true;
              }
              break;


            case "Link-Operaciones-sewing":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(SewingComponent);
                let Sewing: ComponentRef<SewingComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                Sewing.instance.Link = "Link-Operaciones-sewing";
                Sewing.instance.Open = true;
              }
              break;

          case "Link-Operaciones-sewing-accuracy":
             if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(SewingAccuracyComponent);
              let SewingAccuracy: ComponentRef<SewingAccuracyComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              SewingAccuracy.instance.Link = "Link-Operaciones-sewing-accuracy";
              SewingAccuracy.instance.Open = true;
              }
            break;


          case "Link-Operaciones-producto":
             if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(ProductoComponent);
              let Producto: ComponentRef<ProductoComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              Producto.instance.Link = "Link-Operaciones-producto";
              Producto.instance.Open = true;
            }
            break;

          case "Link-Operaciones-ounce":
               if(this.Esquema._Id != _Id)
                {
                  this.dinamycHost.viewContainerRef!.clear();

                  component = this.componentFactoryResolver.resolveComponentFactory(FabricOunceComponent);
                  let Ounce: ComponentRef<FabricOunceComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                  Ounce.instance.Link = "Link-Operaciones-ounce";
                  Ounce.instance.Open = true;
                }
              break;

          case "Link-Operaciones-data-machine":
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(DataMachineComponent);
                let DataMachine: ComponentRef<DataMachineComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                DataMachine.instance.Link = "Link-Operaciones-data-machine";
                DataMachine.instance.Open = true;
                }
            break;


          case "Link-Operaciones-Development-Methos-Analisys":
            if(this.Esquema._Id != _Id)
            {

              this.dinamycHost.viewContainerRef!.clear();
 
              component = this.componentFactoryResolver.resolveComponentFactory(MethodAnalysisComponent);
              let MethodAnalysis: ComponentRef<MethodAnalysisComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              MethodAnalysis.instance.Link = "Link-Operaciones-Development-Methos-Analisys";
              MethodAnalysis.instance.Open = true;
              }
          break;


          case "Link-Operaciones-Matriz-Data":
             if(this.Esquema._Id != _Id)
            {
              this.dinamycHost.viewContainerRef!.clear();

              component = this.componentFactoryResolver.resolveComponentFactory(MatrizOperacionComponent);
              let MatrizData: ComponentRef<MatrizOperacionComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
              MatrizData.instance.Link = "Link-Operaciones-Matriz-Data";
              MatrizData.instance.Open = true;
             
              }
          break;
            

        }
        break;
 
      case "PLN":
        switch(_Id)
        {

          case "Link-Pln-datos-planing":
  
            index = this.dialog.openDialogs.findIndex(f => f.id == _Id)

            if(this.dialogOpen == "" || index == -1)
            {
             
              if(index != -1) this.dialog.openDialogs.splice(index, 1);

              this.dialog.open(UploadExcelComponent, {
                data: _Id,
                id : _Id
              });

              this.dialogOpen  = _Id;
            } 

            

            break;

  
            case "Link-Planing":
  
              
               if(this.Esquema._Id != _Id)
              {
                this.dinamycHost.viewContainerRef!.clear();

                component = this.componentFactoryResolver.resolveComponentFactory(PlaningComponent);
                let Planing: ComponentRef<PlaningComponent> = this.dinamycHost.viewContainerRef.createComponent(component);
                Planing.instance.Link = _Id;
                 Planing.instance.Open = true;
              }
  
              break;
          }
        break;
    }

    element = <HTMLElement>document.getElementById(_Id)?.parentElement?.parentElement?.parentElement;
    element.classList.add("active");
    document.getElementById(_Id)?.classList.add("active");
    

    
   this.Esquema.ActivarForm(_Id);

  
  }

  Salir()
  {
    this.loginserv.CerrarSession();
  }


  Modulo(m : string)
  {


    if(m == "HOM" ) this.str_Modulo = "Inicio"

    if(m == "SIS" ) this.str_Modulo = "Configuración"


    if(m == "PRM" ) this.str_Modulo = "Manufacturing Solution System"

    if(m == "INV" ) this.str_Modulo = "Inventario"

    if(m == "PLN" ) this.str_Modulo = "Planing"
    
    this.str_Esquema = m;
    this.Esquema._Esquema = m;
    this.Esquema._Id = "";
   
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

      if(s == "CerrarTodo") this.dialog.closeAll();
      

      this.NomUsuario = this.loginserv.Nombre;

      this.Perfiles();
    });



  }



}
