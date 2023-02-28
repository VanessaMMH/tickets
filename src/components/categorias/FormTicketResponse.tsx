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
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export interface IFromLibroProps {
  ticket: ITicket;
  context: WebPartContext;
  onChange: (ticket: ITicket) => void;
}

export default function FormTicket(props: IFromLibroProps) {
  const { categorias, handler } = useBiblioteca();
  const { ticket, onChange } = props;

  const getUserByEmail = async (email: string) => {
    let item = { Id: 0, Title: "" };
    try {
      const items = await sp.web.siteUsers
        .filter(`EMail eq '${email}'`)
        .select("Id")
        .get();
      item = items[0];
    } catch (ex) {
      item = { Id: 0, Title: "" };
    }
    return item;
  };

  const _getPeoplePickerItems = async (user: IPeoplePicker[]) => {
    const email = user[0].secondaryText;
    console.log("email", email);
    const person = await getUserByEmail(email);
    return person.Id;
  };

  return (
    <section className={styles.containerPicker}>
      <TextField
        label="Título"
        disabled
        value={ticket.Title}
        onChange={(_, nv) => {
          onChange({ ...ticket, Title: nv });
        }}
      />
      <TextField
        label="Descripcion"
        disabled
        value={ticket.Descripcion}
        multiline
        rows={3}
        onChange={(_, nv) => {
          onChange({ ...ticket, Descripcion: nv });
        }}
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
      <PeoplePicker
        context={props.context as any}
        titleText="Selecciona el Responsable"
        placeholder="Ingresa el nombre"
        personSelectionLimit={1}
        showtooltip={true}
        principalTypes={[PrincipalType.User]}
        onChange={async (ev) => {
          const id = await _getPeoplePickerItems(ev);
          onChange({ ...ticket, ResponsableId: id });
        }}
      />
      <TextField
        label="Respuesta"
        value={ticket.Respuesta}
        multiline
        rows={3}
        onChange={(_, nv) => {
          onChange({ ...ticket, Respuesta: nv, Estado: "Atendido" });
        }}
      />
    </section>
  );
}
