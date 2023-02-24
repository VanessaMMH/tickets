import {getItems,saveItem,deleteItem,initialize, cleanItem} from './spbase';

 
const getUserById= async (id) => await getUserById(id)
const getTickets = async (query) => await getItems('Ticket', query, '*,Categoria/Title,Responsable/Title,Responsable/EMail','Categoria,Responsable');
const saveTicket = async (item) => await saveItem('Ticket', await cleanItem('Ticket', item));
const getCategoria = async (query) => await getItems('Categoria', query, '*');
const saveCategoria = async (item) => await saveItem('Categoria', await cleanItem('Categoria', item));
const deleteCategoria = async (id) => await deleteItem('Categoria', id);


export {
    getUserById,
    getTickets,
    saveTicket,
    getCategoria,
    saveCategoria,
    deleteCategoria,
    initialize,
}