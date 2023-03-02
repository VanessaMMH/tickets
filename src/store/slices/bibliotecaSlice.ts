import ICategoria from "@/entities/ICategoria";
import ITicket from "@/entities/ITicket";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTicketsWithQuery,
  getCurrentUser,
  getUserByEmail,
  getCategoria,
  saveCategoria,
  deleteCategoria,
  getTickets,
  saveTicket,
} from "@api/dataservice";
import { RootState } from "../store";



export interface BibliotecaSlice {
  categorias: ICategoria[];
  categoriaActual: ICategoria;
  tickets: ITicket[];
  ticketActual: ITicket;
  ticketsWithQuery: ITicket[];
  userId: number;
}

const initialState: BibliotecaSlice = {
  categorias: [],
  tickets: [],
  categoriaActual: null,
  ticketActual: null,
  ticketsWithQuery: null,
  userId: 43,
};

const refreshBiblioteca = createAsyncThunk(
  "biblioteca/refreshBiblioteca",
  async () => {
    const [_categorias, _tickets, _ticketsWithQuery] = await Promise.all([
      getCategoria(),
      getTickets(),
      getTicketsWithQuery(initialState.userId),
    ]);

    return {
      categorias: _categorias,
      tickets: _tickets,
      ticketsWithQuery: _ticketsWithQuery,
    };
  }
);

async function fetchExample() {
  try {
    const response = await getCurrentUser();
    if (response.ok) {
      console.log("Todo bien");
    } else {
      console.log("Respuesta de red OK pero respuesta de HTTP no OK");
    }
  } catch (error) {
    console.log("Hubo un problema con la petición Fetch:" + error.message);
  }
}

// fetchExample().catch(console.error)

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

const guardarTicketWithQuery = createAsyncThunk<void, void>(
  "biblioteca/saveTicketWithQuery",
  async (_, { dispatch, getState }) => {
    const {
      biblioteca: { ticketActual },
    } = getState() as RootState;
    await saveTicket(ticketActual);
    await dispatch(refreshBiblioteca());
  }
);

const removeCategoria = createAsyncThunk(
  "biblioteca/removeCategoria",
  async (id: number, { dispatch }) => {
    await deleteCategoria(id);
    return dispatch(refreshBiblioteca());
  }
);

const getByEmail = createAsyncThunk(
  "biblioteca/getUserByEmail",
  async (email: string, { dispatch }) => {
    await getUserByEmail(email);
    return dispatch(refreshBiblioteca());
  }
);


export const bibliotecaSlice = createSlice({
  name: "biblioteca",
  initialState,
  reducers: {
    //sincrono
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setTicketsWithQuery: (state, action) => {
      state.ticketsWithQuery = action.payload;
    },
    setCurrentTicket: (state, action) => {
      state.ticketActual = action.payload;
    },
  },
  extraReducers: (builder) => {
    //asincrono
    builder.addCase(refreshBiblioteca.fulfilled, (state, action) => {
      state.tickets = action.payload.tickets;
      state.ticketsWithQuery = action.payload.ticketsWithQuery;
      state.categorias = action.payload.categorias;
    });
    builder.addCase(refreshBiblioteca.rejected, (state, action) => {
      state.tickets = [];
      state.ticketsWithQuery = [];
      state.categorias = [];
    });
  },
});

export const { setTickets, setCurrentTicket } = bibliotecaSlice.actions;
export {
  refreshBiblioteca,
  guardarCategoria,
  removeCategoria,
  guardarTicket,
  getByEmail,
  guardarTicketWithQuery,
};
export default bibliotecaSlice.reducer;
