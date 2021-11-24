export class Conexion {

    private IP : string = "localhost";
    private PORT : String =  "44311";


    Url() : string{
        return "https://"+this.IP+":"+this.PORT+"/api/"; 
    }

}
