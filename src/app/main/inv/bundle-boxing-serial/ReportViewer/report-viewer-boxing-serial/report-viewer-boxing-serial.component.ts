import { Component, OnInit, } from '@angular/core';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { BundleBoxingSerialService } from 'src/app/main/Services/inv/BundleBoxingSerial/bundle-boxing-serial.service';


@Component({
  selector: 'app-report-viewer-boxing-serial',
  templateUrl: './report-viewer-boxing-serial.component.html',
  styleUrls: ['./report-viewer-boxing-serial.component.css']
})
export class ReportViewerBoxingSerialComponent implements OnInit {

  private Cnx : Conexion = new Conexion();

  public serviceUrl: string = "";
  public reportPath: string = "";
  public reportData: any;
  public Remote : string = "Remote"
  public isPrintMode: boolean = false;
  public parameters: any;
  public pageSettings : any;
  public toolbarSettings : any;
  
  constructor(private BundleBoxingSerialService : BundleBoxingSerialService) { 

  }

  Imprimir(Serial : any){

    this.serviceUrl = this.Cnx.Url() + "BundleBoxing/ReportViewerBoxinSerial";
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

  
  ngOnInit(): void {
    this.BundleBoxingSerialService.change.subscribe(s => {

      if(s[0] == "Imprimir") {
        this.Imprimir(s[1] );
      }

      if(s[0] == "Limpiar"){
        this.Limpiar();
      }
      
    });
  }


}
