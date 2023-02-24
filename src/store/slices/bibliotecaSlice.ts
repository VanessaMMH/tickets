import ICategoria from "@/entities/ICategoria";
import ITicket from "@/entities/ITicket";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserById,
  getCategoria,
  saveCategoria,
  deleteCategoria,
  getTickets,
  saveTicket
} from "@api/dataservice";

export interface BibliotecaSlice {
  categorias: ICategoria[];
  categoriaActual: ICategoria;
  tickets:ITicket[];
  ticketActual: ITicket;
}

const initialState: BibliotecaSlice = {
  categorias: [],
  tickets:[],
  categoriaActual: null,
  ticketActual: null,
};

const refreshBiblioteca = createAsyncThunk(
  "biblioteca/refreshBiblioteca",
  async () => {
    const [_categorias,_tickets] = await Promise.all([getCategoria(),getTickets()]);
    return { categorias: _categorias,tickets:_tickets };
  }
);

const guardarCategoria = createAsyncThunk(
  "biblioteca/saveCategoria",
  async (categoria: ICategoria, { dispatch }) => {
    await saveCategoria(categoria);
    return dispatch(refreshBiblioteca());
  }
);

const guardarTicket = createAsyncThunk(
  "biblioteca/saveTicket",
  async (ticket: ITicket, { dispatch }) => {
    await saveTicket(ticket);
    return dispatch(refreshBiblioteca());
  }
);

// const guardarTicket = createAsyncThunk<void, void>(
//   "biblioteca/saveTicket",
//   async (_, { dispatch, getState }) => {
//     const {
//       biblioteca: { ticketActual },
//     } = getState() as any;
//     await saveTicket(ticketActual);
//     await dispatch(refreshBiblioteca());
//   }
// );
const removeCategoria = createAsyncThunk(
  "biblioteca/removeCategoria",
  async (id: number, { dispatch }) => {
    await deleteCategoria(id);
    return dispatch(refreshBiblioteca());
  }
);

const getUser = createAsyncThunk(
  "biblioteca/getUser",
  async (id: number, { dispatch }) => {
    await getUserById(id);
    return dispatch(refreshBiblioteca());
  }
);

export const bibliotecaSlice = createSlice({
  name: "biblioteca",
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setCurrentTicket: (state, action) => {
      state.ticketActual = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(refreshBiblioteca.fulfilled, (state, action) => {
      state.tickets = action.payload.tickets;
    });
    builder.addCase(refreshBiblioteca.rejected, (state, action) => {
      state.tickets = [];
    });
  },
});

export const { setTickets, setCurrentTicket } = bibliotecaSlice.actions;
export { refreshBiblioteca, guardarCategoria, removeCategoria,guardarTicket,getUser };
export default bibliotecaSlice.reducer;
