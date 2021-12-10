import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBoginxSaco } from 'src/app/main/class/Form/Inv/Interface/I-Saco';
import { IBoginxSerial } from 'src/app/main/class/Form/Inv/Interface/IBoxingSerial';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { ToastService } from 'src/app/main/otro/toast/toast.service';
import { BundleBoxingSacoService } from 'src/app/main/Services/inv/BundleBoxingSaco/bundle-boxing-saco.service';
import { InventarioService } from 'src/app/main/Services/inv/inventario.service';
import { LoginService } from 'src/app/main/Services/Usuario/login.service';

let ELEMENT_DATA : IBoginxSaco[] = [];


@Component({
  selector: 'app-bundle-boxing-saco',
  templateUrl: './bundle-boxing-saco.component.html',
  styleUrls: ['./bundle-boxing-saco.component.css']
})
export class BundleBoxingSacoComponent implements OnInit {



  str_from : string = "";
  str_Serial : string = "";
  dialogConfirmar!: MatDialogRef<BundleBoxingSacoComponent>;
  bol_OpenDialog : boolean = false;
  _Respuesta : any = null;


  displayedColumns: string[] = ['IdSaco', 'Serial',  'Saco', 'NoMesa',  "Usuario", "UsuarioAbre", "FechaRegistro", "Corte", "Activo"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<IBoginxSerial>();

 
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


  constructor(private LoginService : LoginService, private InventarioService : InventarioService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer
    ,  public datepipe: DatePipe, public toastService: ToastService, private BundleBoxingSacoService : BundleBoxingSacoService
    ) {
      this.Limpiar();
     }




  LLenarTabla() : void
  {
    this.BundleBoxingSacoService.change.emit(["Limpiar", ""])
    this.dataSource.data.splice(0, this.dataSource.data.length);

    this.BundleBoxingSacoService.Get().subscribe( s =>{

      let _json = JSON.parse(s);

  
      if(_json["esError"] == 0)
      {
        if(_json["count"] > 0)
        {
          _json["d"].forEach((j : IBoginxSaco) => {
            this.dataSource.data.push(j);
          });
        }
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

      this.dataSource.filter = "";


    });
  }

  Limpiar() : void
  {
    
    document.getElementById("divRegistrosBoginxSaco")?.classList.remove("disabled");

    this._Respuesta = null;
    this.bol_OpenDialog = false;
    this.str_from = "";
    this.str_Serial = "";
    this.dataSource.data.splice(0, this.dataSource.data.length);
    if( this.dialogConfirmar != null)this.dialogConfirmar.close();
    if( this.dialog != null)this.dialog.closeAll();
    this.BundleBoxingSacoService.change.emit(["Limpiar", ""]);
 
  }


    //#region EVENTOS TABLA

  
  
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }  
 
  Eliminar() : void
  {
    this.BundleBoxingSacoService.Eliminar(this.str_Serial, this.LoginService.str_user).subscribe( s =>{

      
      let _json = JSON.parse(s);

  
      if(_json["esError"] == 0)
      {
        this._Respuesta = _json;
        document.getElementById("divRegistrosBoginxSaco")?.classList.remove("disabled");
        this.bol_OpenDialog = false;
        this.str_from = "";
        this.str_Serial = "";
        this.dataSource.data.splice(0, this.dataSource.data.length);
        if( this.dialogConfirmar != null)this.dialogConfirmar.close();
        if( this.dialog != null)this.dialog.closeAll();
        
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

    });

   
  }

  clickRow(evento : string, row : any){

    if(evento == "Eliminar")
    {
      
    this.bol_OpenDialog = true;
    if(this.dialogConfirmar != null) this.dialogConfirmar.close();

    this.dialogConfirmar = this.dialog.open(BundleBoxingSacoComponent, { id: "DialogoConfirmarSaco" });
    this.dialogConfirmar.componentInstance.str_from = "BundleBoxingSacoConfirmar",
    this.dialogConfirmar.componentInstance.str_Serial = row.Serial;

    this.dialogConfirmar.afterOpened().subscribe( s =>{
      document.getElementById("divRegistrosBoginxSaco")?.classList.add("disabled");
    });
    
    this.dialogConfirmar.beforeClosed().subscribe( s =>{

      document.getElementById("divRegistrosBoginxSaco")?.classList.remove("disabled");
      if(this.dialogConfirmar.componentInstance._Respuesta != null)
      {
        let _json = this.dialogConfirmar.componentInstance._Respuesta;
        this.toastService.show(_json["msj"]["Mensaje"], { classname: 'bg-Success text-light', delay: 10000 });
        
        if(_json["esError"] == 0) row.Activo = _json["d"].Activo;

      }
      
    });

    }

    if(evento == "Cerrar")
    {

    }



    if(evento == "Imprimir")
    {
     /* let Serial : ClsSerialBoxing = new ClsSerialBoxing();


      Serial.Corte = row.Corte;
      Serial.CorteCompleto = row.CorteCompleto;
      Serial.Estilo = row.Estilo;
      Serial.Pieza = row.Pieza;
      Serial.IdPresentacionSerial = row.IdPresentacionSerial;
      Serial.IdMaterial = row.IdMaterial;
      Serial.Cantidad = row.Cantidad;
      Serial.Capaje = row.Capaje;
      Serial.EnSaco = row.EnSaco;
      Serial.Serial = row.Serial;
      Serial.Login = "";
    
      this.BundleBoxingSacoService.change.emit(["Imprimir", Serial]);*/
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

  
    //#endregion EVENTOS TABLA

    



    




  ngOnInit(): void {

    this.InventarioService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkBundleBoxingSaco"){
        this.Limpiar();
        this.str_from = "BundleBoxingSaco";
        this.LLenarTabla();
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkBundleBoxingSaco"){
        this.Limpiar();
      }
      
    });
  }

}
