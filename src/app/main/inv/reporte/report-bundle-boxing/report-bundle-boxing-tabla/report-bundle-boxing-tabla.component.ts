import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

export interface IBoxin {
  cIndex: number;
  Grupo : string;
  cMesa : number;
  cSerial : number;
  cNomPieza : string;
  cNoBulto: number;
  cCapaje: number;
  cSeccion: number;
  cNoSaco: number;
  cCorte : string,
  cEstilo : string,
  cUsuario: string;
  cFecha : any;
  cfiltro : string;
}




let ELEMENT_DATA: IBoxin[] = [];



@Component({
  selector: 'app-report-bundle-boxing-tabla',
  templateUrl: './report-bundle-boxing-tabla.component.html',
  styleUrls: ['./report-bundle-boxing-tabla.component.css']
})
export class ReportBundleBoxingTablaComponent implements OnInit {

  
  @ViewChild(MatSort) sort!: MatSort

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      if(value != null) value._intl.getRangeLabel = this.getRangeDisplayText;
    }
  }
  

  str_from : string = "";
  
  int_Seccion : number = 0;
  int_Mesa : number = 0;

  pageIndex : number = 0;
  pageSize : number = 50;
  

  displayedColumns: string[] = ["cIndex", "cSerial","cNomPieza", "cNoBulto", "cCapaje", "cNoSaco", "cUsuario", "cFecha"];
  dataSource =  ELEMENT_DATA;
  int_TotalRegistros = ELEMENT_DATA.length;
  clickedRows = new Set<IBoxin>();


  groupingColumn : any;
  reducedGroups : any = [];
  initialData!: any [];


  constructor(public datepipe: DatePipe){}


  Abrir(_json : any[]) : void{
    this.str_from = "ReportBundleBoxing-Tabla";

    // Replace people with any dataArray !
    if(!this.initData(_json)) return;
    
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
    
    let x : number = 1;
    _json.forEach((j: { Grupo : string, Mesa : number, Serial : number, Nombre : string, Bulto : number, Capaje : number, Seccion : number, Saco : number, Corte : string, Estilo :string, Login : string, Fecha: string}) => {
      ELEMENT_DATA.push({ cIndex : x, Grupo : j.Grupo, cMesa : j.Mesa, cSerial : j.Serial, cNomPieza : j.Nombre, cNoBulto : j.Bulto, cCapaje : j.Capaje, cSeccion : j.Seccion, cNoSaco : j.Saco, cCorte: j.Corte, cEstilo : j.Estilo, cUsuario : j.Login, cFecha : this.datepipe.transform(j.Fecha, 'dd-MM-yyyy hh:mm:ss')?.toString(),
    cfiltro : j.Mesa + " "+ j.Serial + " "+ j.Nombre + " "+ j.Bulto + " "+ j.Capaje + " "+ j.Seccion + " "+ j.Saco + " "+ j.Estilo + " "+ j.Login + " "+ j.Fecha});
      x++;
    });

    this.int_TotalRegistros = ELEMENT_DATA.length;
    this.groupingColumn = "Grupo" 
    this.Paginar();

  }

  

   //#region EVENTO TABLA



  /**
   * Discovers columns in the data
   */
   initData(data : any[]){
    if(!data) return false;
    this.initialData = ELEMENT_DATA;
    return true;
  }

  /**
   * Rebuilds the datasource after any change to the criterions
   */
  buildDataSource(){

    this.dataSource = this.groupBy(this.groupingColumn,this.initialData,this.reducedGroups);
  }
  
  /**
   * Groups the @param data by distinct values of a @param column
   * This adds group lines to the dataSource
   * @param reducedGroups is used localy to keep track of the colapsed groups
   */
   groupBy(column:string,data: any[],reducedGroups?: any[]){
    if(!column) return data;
    let collapsedGroups = reducedGroups;
    if(!reducedGroups) collapsedGroups = [];
    const customReducer = (accumulator : any, currentValue : any) => {
      let currentGroup = currentValue[column];
      if(!accumulator[currentGroup])
      accumulator[currentGroup] = [{
        groupName: `${""} ${currentValue[column]}`,//groupName: `${column} ${currentValue[column]}`,
        value: currentValue[column], 
        isGroup: true,
        reduced: collapsedGroups?.some((group) => group.value == currentValue[column])
      }];
      
      accumulator[currentGroup].push(currentValue);

      return accumulator;
    }
    let groups = data.reduce(customReducer,{});
    let groupArray = Object.keys(groups).map(key => groups[key]);
    let flatList = groupArray.reduce((a,c)=>{return a.concat(c); },[]);

    return flatList.filter((rawLine : any) => {
        return rawLine.isGroup || 
        collapsedGroups?.every((group) => rawLine[column]!=group.value);
      });
  }

  /**
   * Since groups are on the same level as the data, 
   * this function is used by @input(matRowDefWhen)
   */
  isGroup(index : any, item : any): boolean{
    return item.isGroup;
  }

  /**
   * Used in the view to collapse a group
   * Effectively removing it from the displayed datasource
   */
  reduceGroup(row : any){
    row.reduced=!row.reduced;
    if(row.reduced)
      this.reducedGroups.push(row);
    else
      this.reducedGroups = this.reducedGroups.filter((el : any)=>el.value!=row.value);
    
    this.Paginar();
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

  
  SortChange(sort: Sort) {
    let data = this.initialData;
    //const index = data.findIndex((x) => x['level'] == 1);
    if (sort.active && sort.direction !== '') {
      /*if (index > -1) {
        data.splice(index, 1);
      }*/

      
      data = data.sort((a: IBoxin, b: IBoxin) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'cIndex':
            return this.compare(a.cIndex, b.cIndex, isAsc);
          case 'surname':
            return this.compare(a.cNomPieza, b.cNomPieza, isAsc);
          default:
            return 0;
        }
      });
    }

    
    this.Paginar();

    
  }

  private compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setPageSize(e : any) : void
  {
    this.pageIndex, e.pageIndex;
    this.pageSize, e.pageSize;
    this.Paginar();
  }

  Paginar() : void{
    const data = ELEMENT_DATA;
    const startIndex = this.pageIndex * this.pageSize;
    const filter = data.filter(f => f.cfiltro != "").splice(startIndex, this.pageSize);
    const start = filter[0];
    const end = filter[filter.length - 1];
    this.initialData = data.slice().splice(data.indexOf(start), data.indexOf(end) + 1);
    this.buildDataSource();
  }

  
  filtrar(event: Event) {
    let filtro : string = (event.target as HTMLInputElement).value;

    const data = ELEMENT_DATA;
    const startIndex = this.pageIndex * this.pageSize;
    const filter = data.filter(f => ~f.cfiltro.toString().toLowerCase().indexOf(filtro.toLowerCase())).splice(startIndex, this.pageSize);
    const start = filter[0];
    const end = filter[filter.length - 1];
    this.initialData = data.slice().splice(data.indexOf(start), data.indexOf(end) + 1);
    this.buildDataSource();
  }  
 

   //#endregion EVENTO TABLA

   ngOnInit() {
	
	}

  
}