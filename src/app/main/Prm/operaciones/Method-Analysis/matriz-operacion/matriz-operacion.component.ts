import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMethodAnalysis } from 'src/app/main/class/Form/PRM/i-Method-Analysis';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { OperacionesService } from 'src/app/main/Services/Prm/Operaciones/operaciones.service';

let ELEMENT_DATA_OPERATION_MATIX_DATA : IMethodAnalysis[] = [];

@Component({
  selector: 'app-matriz-operacion',
  templateUrl: './matriz-operacion.component.html',
  styleUrls: ['./matriz-operacion.component.css']
})
export class MatrizOperacionComponent implements OnInit {

  public val = new Validacion();
  
  public Open : boolean = false;
  public Link : string = "";

  displayedColumns: string[] = ["IdMethodAnalysis", "Codigo", "Operacion", "Usuario", "Editar", "Eliminar"];
  dataSource = new MatTableDataSource(ELEMENT_DATA_OPERATION_MATIX_DATA);
  clickedRows = new Set<IMethodAnalysis>();


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


  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog : MatDialog, private _OperacionesService : OperacionesService, private datePipe: DatePipe) { 
    this.val.add("txt_Matriz_Data_Fecha_Inicio", "1", "LEN>=", "0");
    this.val.add("txt_Matriz_Data_Fecha_Final", "1", "LEN>=", "0");
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

  
  clickRow(row : IMethodAnalysis, str_Evento : string){

    /*if(str_Evento == "Editar")
    {
      this.Nuevo();
      this.Id = row.IdDataMachine;

      this.val.ValForm.get("txt_Operacion_data_name")?.setValue(row.Name);
      this.val.ValForm.get("txt_Operacion_data_stitch")?.setValue(row.Stitch);
      this.val.ValForm.get("txt_Operacion_data_nomenclature")?.setValue(row.Nomenclature);
      this.val.ValForm.get("txt_Operacion_data_rpm")?.setValue(row.Rpm);
      this.val.ValForm.get("txt_Operacion_data_machine_delay")?.setValue(row.Delay);
      this.val.ValForm.get("txt_Operacion_data_personal")?.setValue(row.Personal);
      this.val.ValForm.get("txt_Operacion_data_fatigue")?.setValue(row.Fatigue);
      this.val.ValForm.get("txt_Operacion_data_machine")?.setValue(row.Machine);
      this.val.ValForm.get("txt_Operacion_data_description")?.setValue(row.Description);
      this.val.ValForm.get("txt_Operacion_data_needle")?.setValue(row.Needle);
      document.getElementById("divOperacion-frm-data-machine-registros")?.classList.add("disabled");
    }
    else
    {
      let _dialog = this.dialog.open(ConfirmarEliminarComponent)
      document.getElementById("body")?.classList.add("disabled");

      _dialog.afterClosed().subscribe( s =>{
        document?.getElementById("body")?.classList.remove("disabled");
        if(_dialog.componentInstance.Retorno == "1")
        {
          this._RowDato = row;
          this.Eliminar();
        }
      });
    }*/
   

  }


  Eliminar() : void
  {
   /* this._RowDato.Evento = "Eliminar";
    this._OperacionesService.GuardarDataMachine(this._RowDato).subscribe( s =>{
  
      let _json = JSON.parse(s);
            
      if(_json["esError"] == 0)
      {
        let index : number = ELEMENT_DATA_MACHINE.findIndex(f =>  Number(f.IdDataMachine) == Number(_json["d"].IdDataMachine));


        if(index >= 0) ELEMENT_DATA_MACHINE.splice(index, 1);
      }
     

      this.dataSource.data = ELEMENT_DATA_MACHINE;
      
      this.dialog.open(DialogoComponent, {
        data : _json["msj"]
      })
  
    });*/
  }


    //#endregion EVENTOS TABLA


  

    Buscar() :void
    {
      ELEMENT_DATA_OPERATION_MATIX_DATA.splice(0, ELEMENT_DATA_OPERATION_MATIX_DATA.length);

      let Fecha_Inicio : string = "";
      let Fecha_Final : string = "";
      

      if(this.val.ValForm.get("txt_Matriz_Data_Fecha_Inicio")?.value != "")
      {
        let date = new Date(this.val.ValForm.get("txt_Matriz_Data_Fecha_Inicio")?.value);
        Fecha_Inicio = String(this.datePipe.transform(date,"yyyy-MM-dd"));
      }

      if(this.val.ValForm.get("txt_Matriz_Data_Fecha_Final")?.value != "")
      {
        let date = new Date(this.val.ValForm.get("txt_Matriz_Data_Fecha_Final")?.value);
        Fecha_Final = String(this.datePipe.transform(date,"yyyy-MM-dd"));
      }


      this._OperacionesService.GetMethodAnalysis(Fecha_Inicio, Fecha_Final).subscribe(s =>{
        let _json = JSON.parse(s);
  
        if(_json["esError"] == 0)
        {
          _json["d"].forEach((d : IMethodAnalysis) => {
            ELEMENT_DATA_OPERATION_MATIX_DATA.push(d);
          });
  
          this.dataSource.data = ELEMENT_DATA_OPERATION_MATIX_DATA;
  
        }
        else
        {
          this.dialog.open(DialogoComponent, {
            data : _json["msj"]
          })
        }
  
      });
    }
  


  Limpiar() : void
  {
    this.val.ValForm.reset();
  }


  ngOnInit(): void {
  }

}
