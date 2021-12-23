import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IFactorCorte } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte';
import { IFactorCorteDetalle } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte-Detalle';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { InventarioService } from 'src/app/main/Services/inv/inventario.service';
import { FactorCorteService } from 'src/app/main/Services/inv/ProcesoCorte/factor-corte.service';

let ELEMENT_DATA_CORTE_FACTOR_DETALLE : IFactorCorteDetalle[] = [];
let ELEMENT_DATA_CORTE_FACTOR : IFactorCorte[] = [];


@Component({
  selector: 'app-factor-corte',
  templateUrl: './factor-corte.component.html',
  styleUrls: ['./factor-corte.component.css']
})
export class FactorCorteComponent implements OnInit {

 
  str_from : string = "";




  displayedColumnsFactor: string[] = ["IdFactorCorte", "Guardar", "Linearecta", "Curva",  "Esquinas", "Piquetes",  "HacerOrificio", "PonerTape"];
  dataSourceFactorCorte = new MatTableDataSource(ELEMENT_DATA_CORTE_FACTOR);
  clickedRowsFactor = new Set<IFactorCorte>();

  
  displayedColumnsDetalle: string[] = ["IdFactorDetalleCorte", "Guardar", "Eliminar", "Item", "Componente", "Estilo",  "LayLimits", "TotalPieces",  "StraightPerimeter", "CurvedPerimeter", "TotalPerimeter", "TotalNotches", "TotalCorners", "Segundos", "Minutos_Pza"];
  dataSourceDetalleFactorCorte = new MatTableDataSource(ELEMENT_DATA_CORTE_FACTOR_DETALLE);
  clickedRowsDetalle = new Set<IFactorCorteDetalle>();

 
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSourceDetalleFactorCorte){
      this.dataSourceDetalleFactorCorte.paginator = value;
      if(this.dataSourceDetalleFactorCorte.paginator != null)this.dataSourceDetalleFactorCorte.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(sort: MatSort) {
     this.dataSourceDetalleFactorCorte.sort = sort;
  }
  
  
  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog : MatDialog, private _FactorCorteService : FactorCorteService
    ,private InventarioService : InventarioService) { }




  
  LLenarTabla() : void
  {

    ELEMENT_DATA_CORTE_FACTOR_DETALLE.splice(0, ELEMENT_DATA_CORTE_FACTOR_DETALLE.length);
    this.dataSourceFactorCorte.data.splice(0, this.dataSourceFactorCorte.data.length);

    ELEMENT_DATA_CORTE_FACTOR.splice(0, ELEMENT_DATA_CORTE_FACTOR.length);
    this.dataSourceDetalleFactorCorte.data.splice(0, this.dataSourceDetalleFactorCorte.data.length);


    this._FactorCorteService.Get().subscribe( s =>{

      let _json = JSON.parse(s);

  
      if(_json["esError"] == 0)
      {
        if(_json["count"] > 0)
        {
          _json["d"][0].forEach((j : IFactorCorte) => {
            this.dataSourceFactorCorte.data.push(j);
          });

          _json["d"][1].forEach((j : IFactorCorteDetalle) => {
            this.dataSourceDetalleFactorCorte.data.push(j);
          });
        }
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

      this.dataSourceFactorCorte.filter = "";
      this.dataSourceDetalleFactorCorte.filter = "";

    });
  }

  Limpiar() : void
  {
    
    ELEMENT_DATA_CORTE_FACTOR_DETALLE.splice(0, ELEMENT_DATA_CORTE_FACTOR_DETALLE.length);
    this.dataSourceDetalleFactorCorte.data.splice(0, this.dataSourceDetalleFactorCorte.data.length);
    this.dataSourceDetalleFactorCorte.filter = "";


    ELEMENT_DATA_CORTE_FACTOR.splice(0, ELEMENT_DATA_CORTE_FACTOR.length);
    this.dataSourceFactorCorte.data.splice(0, this.dataSourceFactorCorte.data.length);
    this.dataSourceFactorCorte.filter = "";

    this.str_from = "";
 
  }




    //#region EVENTOS TABLA


  announceSortChangeDetalle(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceDetalleFactorCorte.filter = filtro.trim().toLowerCase();
  }  
 
  
  clickRow(row : any){
    this._FactorCorteService.Guardar(row).subscribe( s =>{

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

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkProcesoCorteFactor"){
        this.Limpiar();
        this.str_from = "FactorCorte";
        this.LLenarTabla();
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkProcesoCorteFactor"){
        this.Limpiar();
      }
      
    });
  }
}
