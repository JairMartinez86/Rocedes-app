import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IFactorTendido } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Tendido';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { InventarioService } from 'src/app/main/Services/inv/inventario.service';
import { TendidoService } from 'src/app/main/Services/inv/ProcesoTendido/tendido.service';


let ELEMENT_DATA_FACTOR : IFactorTendido[] = [];

@Component({
  selector: 'app-factor-tendido',
  templateUrl: './factor-tendido.component.html',
  styleUrls: ['./factor-tendido.component.css']
})
export class FactorTendidoComponent implements OnInit {


  str_from : string = "";
  
  displayedColumns: string[] = ["IdProcesoTendido",  "Guardar", "Descripcion", "Factor1",  "Factor2", "Factor3",  "Factor4", "Factor5", "Factor6", "Factor7", "Factor8", "Factor9", "Factor10", "Factor11", "Factor12"];
  dataSourceFactorTendido = new MatTableDataSource(ELEMENT_DATA_FACTOR);
  clickedRows = new Set<IFactorTendido>();

 
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSourceFactorTendido){
      this.dataSourceFactorTendido.paginator = value;
      if(this.dataSourceFactorTendido.paginator != null)this.dataSourceFactorTendido.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(sort: MatSort) {
     this.dataSourceFactorTendido.sort = sort;
  }
  
  
  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog : MatDialog, private TendidoService : TendidoService
    ,private InventarioService : InventarioService) { }




  
  LLenarTabla() : void
  {

    ELEMENT_DATA_FACTOR.splice(0, ELEMENT_DATA_FACTOR.length);
    this.dataSourceFactorTendido.data.splice(0, this.dataSourceFactorTendido.data.length);

    this.TendidoService.Get().subscribe( s =>{

      let _json = JSON.parse(s);

  
      if(_json["esError"] == 0)
      {
        if(_json["count"] > 0)
        {
          _json["d"].forEach((j : IFactorTendido) => {
            this.dataSourceFactorTendido.data.push(j);
          });
        }
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

      this.dataSourceFactorTendido.filter = "";


    });
  }

  Limpiar() : void
  {
    
    ELEMENT_DATA_FACTOR.splice(0, ELEMENT_DATA_FACTOR.length);
    this.dataSourceFactorTendido.data.splice(0, this.dataSourceFactorTendido.data.length);
    this.dataSourceFactorTendido.filter = "";
    this.str_from = "";
 
  }




    //#region EVENTOS TABLA


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceFactorTendido.filter = filtro.trim().toLowerCase();
  }  
 
  
  clickRow(row : any){
    this.TendidoService.Guardar(row).subscribe( s =>{

      let _json = JSON.parse(s);
                                 
      this.dialog.open(DialogoComponent, {
        data : _json["msj"]
      })

    });
  }



  
  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Procesos`;  // customize this line
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

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkProcesoTendidoFactor"){
        this.Limpiar();
        this.str_from = "factores";
        this.LLenarTabla();
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkProcesoTendidoFactor"){
        this.Limpiar();
      }
      
    });
  }

}
