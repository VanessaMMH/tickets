import * as React from "react";
import ITicket from "@/entities/ITicket";
import IPeoplePicker from "@/entities/IPeoplePicker";
import useBiblioteca from "@/hooks/useBiblioteca";
import styles from "./FormTicket.module.scss";
import { Dropdown, TextField } from "@fluentui/react";
import { find } from "lodash";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";  
import "@pnp/sp/webs";  
import "@pnp/sp/lists";  
import "@pnp/sp/items"; 
export interface IFromLibroProps {
  ticket: ITicket;
  context:WebPartContext
  onChange: (ticket: ITicket) => void;
}

export default function FormTicket(props: IFromLibroProps) {
  const { categorias } = useBiblioteca();
  const { ticket, onChange } = props;
  // const [curLibro, setCurLibro] = React.useState<ILibro>({} as ILibro);

  const [curUser, setCurUser] =  React.useState(null)

  const _getPeoplePickerItems = (user: IPeoplePicker[]) => {
    const tempUser:any=user
    // users.map(user=>{
    //   setCurUser({...user})
    // })
    setCurUser({...tempUser})
    console.log('user',tempUser)
    console.log('userc',curUser)

  }
  const setPeoplePicker=()=>{
    sp.web.lists
    .getByTitle('Ticket')
    .items.add({ Title:"Responsable",ResponsableId:{results: curUser}})
    .then(()=>alert('ok'))
    .catch(console.error)
    }
  return (
    <section  className={styles.containerPicker}>
      <TextField
        label="Título"
        disabled
        value={ticket.Title}
        onChange={(ev, nv) => {
          onChange({ ...ticket, Title: nv });
        }}
      />
      <TextField
        label="Descripcion"
        disabled
        value={ticket.Descripcion}
        multiline rows={3}
        onChange={(ev, nv) => {
          onChange({ ...ticket, Descripcion: nv });
        }}
      />
      <PeoplePicker
        context={props.context as any}
        titleText="Selecciona el Responsable"
        placeholder="Ingresa el nombre"
        personSelectionLimit={1}
        showtooltip={true}
        // isRequired={true}
        onChange={_getPeoplePickerItems }
        // defaultSelectedUsers={this.props.defaultUsers}
        // principalTypes={[PrincipalType.User]}
      />
      <Dropdown
        label="Categoria"
        options={categorias.map((a) => ({ key: a.Id, text: a.Title }))}
        selectedKey={ticket.CategoriaId}
        onChange={(_, nv) => {
          onChange({
            ...ticket,
            CategoriaId: Number(nv.key),
            Categoria: find(categorias, (aut) => aut.Id === Number(nv.key)),
          });
        }}
      />
      <button onClick={setPeoplePicker}>asgff</button>
    </section>
  );
}
