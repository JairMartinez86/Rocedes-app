import { Component, } from '@angular/core';
import { Conexion } from '../../class/Cnx/conexion';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css']
})
export class ReportViewerComponent {

  private Cnx : Conexion = new Conexion();

  public serviceUrl: string = "";
  public reportPath: string = "";
  public reportData: any;
  public Remote : string = "Remote"
  public isPrintMode: boolean = false;
  public parameters: any;
  public pageSettings : any;
  public toolbarSettings : any;
 


  constructor() { 

    }

    Imprimir(Serial : string){

      this.serviceUrl = this.Cnx.Url() + "ReportViewer";
      this.reportPath = '~/Resources/*.rdl';
      this.isPrintMode = true;
      this.parameters = [Serial];
      this.pageSettings =  {
        width: 3,
        height: 2,
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      }
    };

    this.toolbarSettings = {
      showToolbar: true,
  }
    
  }


    Limpiar(){


      this.serviceUrl = "";
      this.reportPath = "";
      this.isPrintMode = false;
      this.parameters = [];
      this.pageSettings = [];

    }


}
