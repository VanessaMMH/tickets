import IBaseItem from "./IBaseItem";
import ICategoria from "./ICategoria";
import IPersonOrGroupField from "./IPersonOrGroupField";

export default interface ITicket extends IBaseItem{
    Descripcion: string;
    Solicitante:string;
    CategoriaId?: number;
    Categoria?: ICategoria;
    ResponsableId?: number;
    ResponsableTitle?: string;
    ResponsableEmail?: string;
    Responsable?: IPersonOrGroupField ;
    Estado: string;


}