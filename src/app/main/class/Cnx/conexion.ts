export class Conexion {

    private IP : string = "jmartinezapi.azurewebsites.net";
    private PORT : String =  "";

    public TimeVerif: number = 600;
    public TimeClose: number = 30;


    Url() : string{
        return "https://"+this.IP+this.PORT+"/api/"; 
    }

}
