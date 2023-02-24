import * as React from "react";
import ITicket from "@/entities/ITicket";
import useBiblioteca from "@/hooks/useBiblioteca";
import { Dropdown, TextField } from "@fluentui/react";
import { find } from "lodash";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFromLibroProps {
  ticket: ITicket;
  context:WebPartContext
  onChange: (ticket: ITicket) => void;
}

export default function FormTicket(props: IFromLibroProps) {
  const { categorias } = useBiblioteca();
  const { ticket, onChange } = props;
  const _getPeoplePickerItems = (items: any[]) => {
    console.log('Items:', items);
  }
  return (
    <section>
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
        onChange={(ev, nv) => {
          onChange({ ...ticket, Descripcion: nv });
        }}
      />
      <PeoplePicker
        context={props.context as any}
        titleText="Select People"
        placeholder="Enter your Name"
        personSelectionLimit={3}
        showtooltip={true}
        // isRequired={true}
        // selectedItems={_getPeoplePickerItems(ticket.ResponsableTitle?)}
        // defaultSelectedUsers={this.props.defaultUsers}
        principalTypes={[PrincipalType.User]}
      />
      <Dropdown
        label="Categoria"
        options={categorias.map((a) => ({ key: a.Id, text: a.Title }))}
        selectedKey={ticket.CategoriaId}
        onChange={(ev, nv) => {
          onChange({
            ...ticket,
            CategoriaId: Number(nv.key),
            Categoria: find(categorias, (aut) => aut.Id === Number(nv.key)),
          });
        }}
      />
    </section>
  );
}
