import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-continuar',
  templateUrl: './confirmar-continuar.component.html',
  styleUrls: ['./confirmar-continuar.component.css']
})
export class ConfirmarContinuarComponent  {

  public Retorno : string = "0";

  constructor(public hostElement: ElementRef, public dialogRef: MatDialogRef<ConfirmarContinuarComponent>) { }


  Confirmar() : void
  {
    this.dialogRef.close();
    this.Retorno = "1";
  }

  Cancelar() : void
  {
    this.dialogRef.close();
    this.Retorno = "0";
  }


}
