import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface IBoxin {
  cIndex: number;
  cSerial : number;
  cNomPieza : string;
  cNoBulto: number;
  cCapaje: number;
  cNoSaco: number;
  cUsuario: string;
  cFecha : string;
}




let ELEMENT_DATA: IBoxin[] = [
  {cIndex: 0, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "jmg", cFecha : ""},
  {cIndex: 1, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "jmg", cFecha : ""},
  {cIndex: 2, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaa", cFecha : ""},
  {cIndex: 3, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "jmg", cFecha : ""},
  {cIndex: 4, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
  {cIndex: 5, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "jmg", cFecha : ""},
  {cIndex: 6, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
  {cIndex: 7, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
  {cIndex: 8, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
  {cIndex: 9, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
  {cIndex: 10, cSerial: 0, cNomPieza: "Female", cNoBulto: 0, cCapaje: 0, cNoSaco: 0, cUsuario : "aaaa", cFecha : ""},
];



@Component({
  selector: 'app-report-bundle-boxing-tabla',
  templateUrl: './report-bundle-boxing-tabla.component.html',
  styleUrls: ['./report-bundle-boxing-tabla.component.css']
})
export class ReportBundleBoxingTablaComponent implements OnInit {

  str_from : string = "";
  
  int_Seccion : number = 0;
  int_Mesa : number = 0;

  


  //displayedColumns!: string[];

  //dataSource = [];

  groupingColumn : any;

  reducedGroups : any = [];

  initialData!: any [];

  constructor(private _liveAnnouncer: LiveAnnouncer){
    	// Replace people with any dataArray !
      let inputData  = ELEMENT_DATA;

      if(!this.initData(inputData)) return;
  
      this.groupingColumn = "cUsuario"
  
      this.buildDataSource();
  }



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
        groupName: `${column} ${currentValue[column]}`,
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
    
    this.buildDataSource();
  }
  

   //#region EVENTO TABLA


   displayedColumns: string[] = ["cIndex", "cSerial","cNomPieza",  "cSeccion", "cNoBulto", "cCapaje", "cNoSaco", "cUsuario", "cFecha"];
   dataSource = new MatTableDataSource(ELEMENT_DATA);
   clickedRows = new Set<IBoxin>();
   
   
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

  

  SortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }




   //#endregion EVENTO TABLA

   ngOnInit() {
	
	}

  
}