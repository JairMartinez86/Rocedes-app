import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit} from '@angular/core';


import { AbstractControl, FormControl, ValidatorFn, FormGroupDirective, NgForm, Validators, NG_VALIDATORS, FormBuilder, FormGroup, ValidationErrors  } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Validacion } from 'src/app/class/Validacion/validacion';


import {InventarioService} from 'src/app/Services/inv/inventario.service'; 


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-descargue',
  templateUrl: './descargue.component.html',
  styleUrls: ['./descargue.component.css']
})
export class DescargueComponent implements OnInit {

 
  public val = new Validacion();

  
  bol_Open : boolean = false;
  //url : string = '$( function() {$( "#datepicker" ).datepicker();} );';

  url2 : string = 'https://code.jquery.com/jquery-3.6.0.js';
  url3 : string = 'https://code.jquery.com/ui/1.13.0/jquery-ui.js';



  date = new FormControl(new Date());
  serializedDate = new FormControl(
    (new Date()).toISOString(),
    Validators.required
    
    );


  matcher = new MyErrorStateMatcher();

  
  constructor(private InventarioService : InventarioService) { 
    
    this.val.add("NoFact2", "1","LEN>", "0");
    this.val.add("dtFecha", "1","DATE", "18/10/2021");
  }
  
  


  public loadScript() {
    
    
   /* let node2 = document.createElement('script');
    node2.src = this.url2;
    node2.async = false;
    document.getElementsByTagName('head')[0].appendChild(node2);

 

    let node3 = document.createElement('script');
    node3.async = false;
    node3.src = this.url3;


    document.getElementsByTagName('head')[0].appendChild(node3);

    

    let node = document.createElement('script');
    //node.src = this.url;
    //node.type = 'text/javascript';
    node.text = this.url;
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);*/
}



  ngOnInit(): void {
    this.InventarioService.change.subscribe(s => {

      if(s.split(":")[0] == "Open" && s.split(":")[1] == "Descargue"){
        this.bol_Open = true;
      }

       if(s.split(":")[0] == "Close" && s.split(":")[1] == "Descargue"){
        this.bol_Open = false;
      }
      
    });

  }



  
}
