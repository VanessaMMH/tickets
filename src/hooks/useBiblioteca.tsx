import ICategoria from "@/entities/ICategoria";
import ITicket from "@/entities/ITicket";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import {
  guardarCategoria,
  refreshBiblioteca,
  removeCategoria,
  guardarTicket,
  getByEmail,
  guardarTicketWithQuery,
} from "@/store/slices/bibliotecaSlice";

export default function useBiblioteca() {
  const dispatch = useAppDispatch();
  const ticketActual = useSelector<RootState, ITicket>(
    (state) => state.biblioteca.ticketActual
  );

  const categorias = useSelector<RootState, ICategoria[]>(
    (state) => state.biblioteca.categorias
  );
  const tickets = useSelector<RootState, ITicket[]>(
    (state) => state.biblioteca.tickets
  );
  const ticketsWithQuery = useSelector<RootState, ITicket[]>(
    (state) => state.biblioteca.ticketsWithQuery
  );

  const init = async () => {
    await dispatch(refreshBiblioteca());
  };

  const saveCategoria = async (categoria: ICategoria) =>
    await dispatch(guardarCategoria(categoria));

  const saveTicket = async (ticket: ITicket) =>
    await dispatch(guardarTicket(ticket));

  const saveTicketWithQuery = async () =>
    await dispatch(guardarTicketWithQuery());

  const deleteCategoria = async (id: number) =>
    await dispatch(removeCategoria(id));

  const getUserByEmail = async (email: string) =>
    await dispatch(getByEmail(email));

  useEffect(() => {
    init().catch(console.error);
  }, []);

  return {
    categorias,
    tickets,
    ticketActual,
    ticketsWithQuery,
    handler: {
      init,
      saveCategoria,
      deleteCategoria,
      saveTicket,
      saveTicketWithQuery,
      getUserByEmail,
    },
  };
}
