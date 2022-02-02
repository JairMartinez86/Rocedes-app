
import { Component, ElementRef} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent {
  

  public Open : boolean = false;
  public Link : string = "";

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };


  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    },
    multiple: false,
    formatsAllowed: ".xlsx",
    fileNameIndex: true,
    autoUpload: false,

    replaceTexts: {
      selectFileBtn: 'Seleccione el Archivo',
      resetBtn: 'Limpiar',
      uploadBtn: 'Subir',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Archivo procesado.!',
      afterUploadMsg_error: 'Error al subir el archivo. !',
      sizeLimit: 'Tamaño Limite'
    }
};





constructor(private dialogRef: MatDialogRef<UploadExcelComponent>) { }


  fileSelected(event : any) {
  /* wire up file reader */
  const target: DataTransfer = <DataTransfer>(event.target);
  if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    /* read workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    console.log("data:",this.data);
    this.data.map(res=>{
      if(res[0] === "no"){
        console.log(res[0]);
      }else{
        console.log(res[0]);
      }
    })
  };
  reader.readAsBinaryString(target.files[0]);
  }

  
  docUpload (event : any){
    console.log("2")
  }


  Cerrar() : void
  {
    this.dialogRef.close();
  }

}
