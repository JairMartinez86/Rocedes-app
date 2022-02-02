import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadExcelComponent } from 'src/app/main/shared/upload-excel/upload-excel.component';

@Component({
  selector: 'app-datos-planing',
  templateUrl: './datos-planing.component.html',
  styleUrls: ['./datos-planing.component.css']
})
export class DatosPlaningComponent implements OnInit {

  public Open : boolean = false;
  public Link : string = "";

  
  constructor(private dialog: MatDialog) { 

   this.dialog.open(UploadExcelComponent);

  }

  ngOnInit(): void {
  }

}
