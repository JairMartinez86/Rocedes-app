import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Validacion } from 'src/app/main/class/Validacion/validacion';
import { ConfirmarEliminarComponent } from 'src/app/main/otro/dialogo/confirmar-eliminar/confirmar-eliminar.component';
import { DialogoComponent } from 'src/app/main/otro/dialogo/dialogo.component';
import { OperacionesService } from 'src/app/main/Services/inv/Operaciones/operaciones.service';
import { IPartes } from 'src/app/main/class/Form/Inv/Interface/i-Partes';

let ELEMENT_DATA_PARTES : IPartes[] = [];
@Component({
  selector: 'app-partes',
  templateUrl: './partes.component.html',
  styleUrls: ['./partes.component.css']
})
export class PartesComponent implements OnInit {

  public val = new Validacion();
  
  public Open : boolean = false;
  public Link : string = "";


  public Editar : boolean = false;
  private Id : number = -1;
  private _RowDato !: IPartes;


  displayedColumns: string[] = ["IdParte", "Nombre",   "Editar", "Eliminar"];
  dataSource = new MatTableDataSource(ELEMENT_DATA_PARTES);
  clickedRows = new Set<IPartes>();

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
    this.val.add("txt_operacion_partes", "1", "LEN>", "0");
  }


  Limpiar(): void
  {
    this.Id = -1;
    this.Editar = false;
    this.val.ValForm.reset();

    this.val.ValForm.get("txt_operacion_partes")?.disable();
    document?.getElementById("divOperacion-frm-partes-registros")?.classList.remove("disabled");
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


    this.Guardar();

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

  
  clickRow(row : any, str_Evento : string){

    if(str_Evento == "Editar")
    {
      this.Nuevo();
      this.Id = row.IdParte;
      this.val.ValForm.get("txt_operacion_partes")?.setValue(row.Nombre);
      document.getElementById("divOperacion-frm-partes-registros")?.classList.add("disabled");
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
    }
   

  }


  Eliminar() : void
  {
    this._RowDato.Evento = "Eliminar";
    this._OperacionesService.GuardarPartes(this._RowDato).subscribe( s =>{
  
      let _json = JSON.parse(s);
            
      if(_json["esError"] == 0)
      {
        let index : number = ELEMENT_DATA_PARTES.findIndex(f =>  Number(f.IdParte) == Number(_json["d"].IdParte));


        if(index >= 0) ELEMENT_DATA_PARTES.splice(index, 1);
      }
     

      this.dataSource.data = ELEMENT_DATA_PARTES;
      
      this.dialog.open(DialogoComponent, {
        data : _json["msj"]
      })
  
    });
  }


  LlenarTabla() :void
  {
    ELEMENT_DATA_PARTES.splice(0, ELEMENT_DATA_PARTES.length);

    this._OperacionesService.GetPartes().subscribe(s =>{
      let _json = JSON.parse(s);

      if(_json["esError"] == 0)
      {
        _json["d"].forEach((d : IPartes) => {
          ELEMENT_DATA_PARTES.push(d);
        });

        this.dataSource.data = ELEMENT_DATA_PARTES;

      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

    });
  }

  
    //#endregion EVENTOS TABLA


  Nuevo() :void
  {
    this.Id = -1;
    this.Editar = true;
    this.val.ValForm.get("txt_operacion_partes")?.enable();

    document.getElementById("txt_operacion_codigo_gsd")?.focus();
  }

  Guardar() : void
  {
    let datos : IPartes = {} as IPartes;
    datos.IdParte = this.Id;
    datos.Nombre = String(this.val.ValForm.get("txt_operacion_partes")?.value).trimEnd();
    datos.Evento = "Nuevo";
    if(this.Id > 0) datos.Evento = "Editar";

    this._OperacionesService.GuardarPartes(datos).subscribe( s =>{
  
      let _json = JSON.parse(s);
     let _dialog =  this.dialog.open(DialogoComponent, {
        data : _json["msj"]
      })

      _dialog.afterClosed().subscribe(s =>{
        if(_json["esError"] == 0)
        {

          let index : number = ELEMENT_DATA_PARTES.findIndex(f =>  Number(f.IdParte) == Number(_json["d"].IdParte));

          if(index >= 0)
          {
            ELEMENT_DATA_PARTES[index].Nombre = _json["d"].Nombre;
          }
          else
          {
            ELEMENT_DATA_PARTES.push(_json["d"]);
          }
          this.dataSource.data = ELEMENT_DATA_PARTES;
          this.Limpiar();
         
        }
      });

  
    });


  }


  ngOnInit(): void {
    this.Limpiar();
    this.LlenarTabla();
  }

}
