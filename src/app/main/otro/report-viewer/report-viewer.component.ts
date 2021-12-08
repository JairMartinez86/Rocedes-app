import { Component, } from '@angular/core';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css']
})
export class ReportViewerComponent {


  public serviceUrl: string = "";
  public reportPath: string = "";
  public reportData: any;
  public Remote : string = "Local"
  public isPrintMode: boolean = false;
  public parameters: any;
  public pageSettings : any;
  public toolbarSettings : any;
 


  constructor() { 

    }

    Imprimir(Serial : string){

      this.serviceUrl = 'https:/localhost:44311/api/ReportViewer';
      this.reportPath = '~/Resources/SerialComponente.rdl';
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
      showToolbar: false,
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