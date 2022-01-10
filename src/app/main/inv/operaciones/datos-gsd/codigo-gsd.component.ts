import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICodigoGSD } from 'src/app/main/class/Form/Inv/Interface/i-Codigo-GSD';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { OperacionesService } from 'src/app/main/Services/inv/Operaciones/operaciones.service';


let ELEMENT_DATA_CODIGO_GSD : ICodigoGSD[] = [];
@Component({
  selector: 'app-codigo-gsd',
  templateUrl: './codigo-gsd.component.html',
  styleUrls: ['./codigo-gsd.component.css']
})
export class CodigoGsdComponent implements OnInit {

  public val = new Validacion();
  
  public Open : boolean = false;
  public Link : string = "";


  public Editar : boolean = false;


  displayedColumns: string[] = ["IdCodGSD", "CodigoGSD",   "Tmus"];
  dataSource = new MatTableDataSource(ELEMENT_DATA_CODIGO_GSD);
  clickedRows = new Set<ICodigoGSD>();

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





  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog : MatDialog, private _OperacionesService : OperacionesService) { 
    this.val.add("txt_operacion_codigo_gsd", "1", "LEN>", "0");
    this.val.add("txt_operacion_tmu", "1", "LEN>", "0");
    this.val.add("txt_operacion_tmu", "2", "NUM>", "0");
  }


  Limpiar(): void
  {
    this.Editar = false;
    this.val.ValForm.reset();

    this.val.ValForm.get("txt_operacion_codigo_gsd")?.disable();
    this.val.ValForm.get("txt_operacion_tmu")?.disable();

  }


  Cerrar() :void
  {

    this.Limpiar();
    this.Link = "";
    this.Open = false;
  }


  onKeyEnter(event: any) : void
  {
    let _input : string = event.target.id;
    

    if(event.target.value == "") {
      document?.getElementById(_input)?.focus();
      event.preventDefault();
      return;
    }


    switch(_input){

      case "txt_operacion_codigo_gsd":
        document?.getElementById("txt_operacion_tmu")?.focus();
        break;

      case "txt_operacion_tmu":
        this.Guardar();
        break;
    }

  }




   //#region EVENTOS TABLA


   announceSort(sortState: Sort) {
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
 

  
  clickRow(row : any, str_Evento : string){

    if(str_Evento == "Editar")
    {
     
    }

    else
    {
      this._OperacionesService.EliminarCodigoGSD(row.IdCodGSD).subscribe( s =>{

        let _json = JSON.parse(s);
              
        
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
  
      });
    }
    
  }



  
  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Registros`;  // customize this line
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


  Nuevo() :void
  {
    this.Editar = true;
    this.val.ValForm.get("txt_operacion_codigo_gsd")?.enable();
    this.val.ValForm.get("txt_operacion_tmu")?.enable();

    document.getElementById("txt_operacion_codigo_gsd")?.focus();
  }

  Guardar() : void
  {
    
  }


  ngOnInit(): void {
    this.Limpiar();
  }

}
