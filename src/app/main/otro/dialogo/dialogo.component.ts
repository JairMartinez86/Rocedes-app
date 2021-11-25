import { Component, OnInit,Inject, ElementRef, HostListener  } from '@angular/core';
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

  public autoClose : boolean = true;
  
  
  //#region DIALOGO
  @HostListener('document:click', ['$event'])
  clickout(event : any) {
    if (this.clickoutHandler) {
      this.clickoutHandler(event);
    }
  }
  clickoutHandler!: Function;

  closeDialogFromClickout(event: MouseEvent) {
    if(!this.autoClose) return;
    const matDialogContainerEl = this.dialogRef.componentInstance.hostElement.nativeElement.parentElement;
    const rect = matDialogContainerEl.getBoundingClientRect()

    if(event.clientX <= rect.left || event.clientX >= rect.right || 
        event.clientY <= rect.top || event.clientY >= rect.bottom) {
          this.dialogRef.close();
    }
  }


  //#endregion DIALOGO

  constructor(public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogoComponent>,
    @ Inject(MAT_DIALOG_DATA) public data : any) { 

   
      this.str_Error = data["Codigo"];
      this.str_Mensaje = data["Mensaje"];
      if(data["Codigo"] == "") this.str_Caption = "";
      this.clickoutHandler = this.closeDialogFromClickout;
 
    }


  
  
  ngOnInit(): void {
  }

}
