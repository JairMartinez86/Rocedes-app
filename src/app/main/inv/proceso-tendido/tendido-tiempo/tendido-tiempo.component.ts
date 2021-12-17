import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IFactorTendido } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Tendido';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { InventarioService } from 'src/app/main/Services/inv/inventario.service';
import { TendidoService } from 'src/app/main/Services/inv/ProcesoTendido/tendido.service';

let ELEMENT_DATA_TIEMPO : IFactorTendido[] = [];

@Component({
  selector: 'app-tendido-tiempo',
  templateUrl: './tendido-tiempo.component.html',
  styleUrls: ['./tendido-tiempo.component.css']
})
export class TendidoTiempoComponent implements OnInit {

  public val = new Validacion();

  public str_from : string = "";

  public TotalYardas : number = 0;


  
  displayedColumns: string[] = ["IdProcesoTendido", "Descripcion",   "TotalFactor", "Minutos"];
  dataSource = new MatTableDataSource(ELEMENT_DATA_TIEMPO);
  clickedRows = new Set<IFactorTendido>();

 
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
  
  
  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog : MatDialog, private TendidoService : TendidoService
    ,private InventarioService : InventarioService) {

      this.val.add("txt_Tendido_Cantidad_Capas", "1", "NUM>", "0");
      this.val.add("txt_Tendido_Cantidad_Rollos", "1", "NUM>", "0");
      this.val.add("txt_Tendido_Cantidad_Yardas", "1", "NUM>", "0");
     }




  

  Limpiar() : void
  {
    
    ELEMENT_DATA_TIEMPO.splice(0, ELEMENT_DATA_TIEMPO.length);
    this.dataSource.data.splice(0, this.dataSource.data.length);
    this.str_from = "";

  }


  calcularMinutos() : void
  {
    
  
    let Minutos : number = 0;
    let Factor : number = 0;
    let index : number = 0;
    let CantidadRollos : number = Number(this.val.ValForm.get("txt_Tendido_Cantidad_Rollos")?.value);
    let CantidadCapas : number = Number(this.val.ValForm.get("txt_Tendido_Cantidad_Capas")?.value);
    let CantidadYardas : number = Number(this.val.ValForm.get("txt_Tendido_Cantidad_Yardas")?.value);

    this.TotalYardas = CantidadCapas * CantidadYardas;

    if(this.val.ValForm.invalid)  return


    this.dataSource.data.forEach( f =>{

      switch(f.Orden)
      {
 
        case 2:
            f.Minutos = f.Factor1 / this.TotalYardas;
            f.Minutos += f.Factor2 * CantidadRollos;
          break;

          case 3:
            f.Minutos = f.Factor1 / this.TotalYardas;
            f.Minutos += f.Factor2 * CantidadYardas;
            f.Minutos += f.Factor3 / this.TotalYardas;
            f.Minutos += f.Factor4 * CantidadYardas;
            f.Minutos += f.Factor5 / CantidadYardas;
            f.Minutos += f.Factor6 * CantidadYardas;
            f.Minutos += f.Factor7 / this.TotalYardas;
            f.Minutos += f.Factor8 * CantidadYardas;
            f.Minutos += f.Factor9 / this.TotalYardas;
            f.Minutos += f.Factor10 * CantidadYardas;
            f.Minutos += f.Factor11 / this.TotalYardas;
            f.Minutos += f.Factor12 * CantidadYardas;
            
          break;

          case 4:
            f.Minutos = f.Factor1 / this.TotalYardas;
            f.Minutos += f.Factor2 * CantidadYardas;
            f.Minutos += f.Factor3 / this.TotalYardas;
            f.Minutos += f.Factor4 * CantidadYardas;

            break

            case 5:
              f.Minutos = f.Factor1 * CantidadCapas;
              f.Minutos += f.Factor2 * (CantidadYardas * CantidadCapas);
              f.Minutos += f.Factor3 * CantidadCapas;
              f.Minutos += f.Factor4 * (CantidadYardas * CantidadCapas);
              f.Minutos += f.Factor5 / this.TotalYardas;
              f.Minutos += f.Factor6 * CantidadYardas;
              f.Minutos += f.Factor7 / this.TotalYardas;

              break;

              case 6:
                f.Minutos = f.Factor1 * CantidadCapas;
                f.Minutos += f.Factor2 * CantidadYardas * CantidadCapas;
                f.Minutos += f.Factor3 * CantidadCapas;
                f.Minutos += f.Factor4 * CantidadCapas * CantidadYardas;

                break;


              case 9:
                f.Minutos = (f.Factor1 * CantidadYardas) + f.Factor2;

                break;

      }

      Factor += f.TotalFactor;
      Minutos += f.Minutos;

    });

  
    let RegistroTotal: IFactorTendido = {} as IFactorTendido;

    RegistroTotal.IdProcesoTendido = -1;
    RegistroTotal.Descripcion = "TOTAL DE TIEMPO EN MINUTOS POR TENDIDO";
    RegistroTotal.TotalFactor = Factor;
    RegistroTotal.Minutos = Minutos

    
    index = this.dataSource.data.findIndex(f => f.IdProcesoTendido == -1)

    if(index > 0) this.dataSource.data.splice(index, 1);

    this.dataSource.data.push(RegistroTotal);
    this.dataSource.filter = "";
    

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
    this.dataSource.filter = filtro.trim().toLowerCase();
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


    LLenarTabla() : void
    {
  
      ELEMENT_DATA_TIEMPO.splice(0, ELEMENT_DATA_TIEMPO.length);
      this.dataSource.data.splice(0, this.dataSource.data.length);
  
      this.TendidoService.Get().subscribe( s =>{
  
        let _json = JSON.parse(s);
  
    
        if(_json["esError"] == 0)
        {
          if(_json["count"] > 0)
          {
            
            _json["d"].forEach((j : IFactorTendido) => {
              this.dataSource.data.push(j);
            });

            this.calcularMinutos();
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

    
    onKeyEnter(event: any){
    

      let _input : string = event.target.id;
      
  
      if(event.target.value == "") {
        document?.getElementById(_input)?.focus();
        event.preventDefault();
        return;
      }


      switch(_input){

        case "txt_Tendido_Cantidad_Capas":
          document?.getElementById("txt_Tendido_Cantidad_Rollos")?.focus();
          break;
  
          case "txt_Tendido_Cantidad_Rollos":
            document?.getElementById("txt_Tendido_Cantidad_Yardas")?.focus();
          break;
  
         
      }
  
  
      event.preventDefault();
  
    }



  ngOnInit(): void {
    this.InventarioService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "LinkProcesoTendidoTiempo"){
        this.Limpiar();
        this.str_from = "tiempo";
        this.LLenarTabla();
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "LinkProcesoTendidoTiempo"){
        this.Limpiar();
      }
      
    });
  }
}
