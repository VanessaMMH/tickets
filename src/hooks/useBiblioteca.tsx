import ICategoria from "@/entities/ICategoria";
import ITicket from "@/entities/ITicket";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { guardarCategoria, refreshBiblioteca, removeCategoria , guardarTicket,getUser} from "@/store/slices/bibliotecaSlice";

export default function useBiblioteca(){
    const dispatch = useAppDispatch();
    const categorias = useSelector<RootState, ICategoria[]>((state) => state.biblioteca.categorias);
    const tickets = useSelector<RootState, ITicket[]>((state) => state.biblioteca.tickets);


    const init = async () => {
        await dispatch(refreshBiblioteca());        
    }

    const saveCategoria = async (categoria: ICategoria) => await dispatch(guardarCategoria(categoria));
    const saveTicket = async (ticket:ITicket) => await dispatch(guardarTicket(ticket));
    const deleteCategoria = async (id: number) => await dispatch(removeCategoria(id));
    const getUserById = async (id: number) => await dispatch(getUser(id));

    useEffect(() => {
        init().catch(console.error);
    }, []);


    return {categorias,tickets, handler: {init, saveCategoria, deleteCategoria,saveTicket,getUserById}};
}