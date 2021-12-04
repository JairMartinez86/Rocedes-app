import { asLiteral } from "@angular/compiler/src/render3/view/util";
import { ElementRef, Renderer2, RendererFactory2 } from "@angular/core";

export class Formulario
{

    public _Form : string = '';
    public _Nombre : string = '';
    public _Activo : boolean = false;

    constructor(Form : string, Nombre : string, Activo : boolean){
        this._Form = Form;
        this._Nombre = Nombre;
        this._Activo = Activo;
    }



}


export class Esquema {


    
    public _Esquema : string = '';
    public _Nombre : string = '';
    public _Activo : boolean = false;

    private _Form : Formulario[] = [];


    constructor(Esquema : string, Nombre : string, Activo : boolean, Form  : Formulario){
        this._Esquema = Esquema;
        this._Nombre = Nombre;
        this._Activo = Activo;

        this._Form.push(Form);

    }

    private buscar(id : string) : Formulario{
        let form : Formulario;



        if(id = ""){
            form = <Formulario>this._Form.find(x => x._Activo);
        }
        else{
            form = <Formulario>this._Form.find(x => x._Form == id);
        }
        
      
        return form;
    }



    ActivarForm(m : string){
        let form : Formulario = <Formulario>this.buscar(m);

        if(form != null)
        {
            form._Activo = true;

            this._Form.forEach(element => {

                if(m != element._Form){
                    element._Activo = false;
                }
                
            });
        }

    }

    getActivo() : string{
        let form : Formulario = <Formulario>this._Form.find(x => x._Activo);

        if(form != null)
        {
            return form._Form;
        }

        return "";
    }
   
   
}
