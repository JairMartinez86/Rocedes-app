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
  public json : string[] = [];
  public Remote : string = "Local"
  public isPrintMode: boolean = false;
 


  constructor() { 

        this.serviceUrl = 'https://localhost:44311//api/ReportViewer';
        this.reportPath = '~/Resources/SerialComponente.rdl';
    this.isPrintMode = true;
    }

  
    

}
