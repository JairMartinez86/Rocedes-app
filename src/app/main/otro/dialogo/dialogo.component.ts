import { Component, OnInit,Inject, ElementRef  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';;

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  public str_Titulo : string = "Información";
  public str_Mensaje : string = "";
  public str_Caption : string = "Código: ";
  public str_Error : string = "";
  

  constructor(public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogoComponent>,
    @ Inject(MAT_DIALOG_DATA) public data : any) { 

      this.dialogRef.disableClose = false;
      this.str_Error = data["Codigo"];
      this.str_Mensaje = data["Mensaje"];
      if(data["Codigo"] == "") this.str_Caption = "";

 
    }


  
  
  ngOnInit(): void {
  }

}
