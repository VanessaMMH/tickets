import {
  getItems,
  saveItem,
  deleteItem,
  initialize,
  cleanItem,
} from "./spbase";

const getTickets = async (query) =>
  await getItems(
    "Ticket",
    query,
    "*,Categoria/Title,Responsable/Title,Responsable/EMail",
    "Categoria,Responsable"
  );
const getTicketsWithQuery = async (userId) =>
  await getItems(
    "Ticket",
    `SolicitanteId eq ${userId}`,
    "*,Solicitante/Id,Categoria/Title,Responsable/Title",
    "Solicitante,Categoria,Responsable"
  );
const saveTicket = async (item) =>
  await saveItem("Ticket", await cleanItem("Ticket", item));
const getCategoria = async (query) => await getItems("Categoria", query, "*");
const saveCategoria = async (item) =>
  await saveItem("Categoria", await cleanItem("Categoria", item));
const deleteCategoria = async (id) => await deleteItem("Categoria", id);
const getUserByEmail = async (email) => await getUserByEmail(email);
const getCurrentUser = async () => await getCurrentUser();

export {
  getTicketsWithQuery,
  getUserByEmail,
  getCurrentUser,
  getTickets,
  saveTicket,
  getCategoria,
  saveCategoria,
  deleteCategoria,
  initialize,
};
