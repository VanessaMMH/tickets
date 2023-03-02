import * as React from "react";
import styles from "./Tickets.module.scss";
import useBiblioteca from "@/hooks/useBiblioteca";
import ITicket from "@/entities/ITicket";
import { TextField, Dropdown } from "@fluentui/react";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { DetailsList, IColumn, Panel, PrimaryButton } from "@fluentui/react";
import {
  guardarTicketWithQuery,
  setCurrentTicket,
} from "@/store/slices/bibliotecaSlice";
import { find } from "lodash";

interface ITicketsProps {
  title: string;
  textValue?: string;
  visible?: boolean;
}

export default function Tickets({ title }: ITicketsProps): JSX.Element {
  
  const { categorias,ticketsWithQuery, ticketActual, handler } = useBiblioteca();
  const dispatch = useAppDispatch();
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [hiddenLibDlg, setHiddenLibDlg] = React.useState<boolean>(true);

  const saveTicket = async () => {
    dispatch(
      setCurrentTicket({
        ...ticketActual,
        Estado: "Abierto",
        SolicitanteId:43
      })
    );
    await dispatch(guardarTicketWithQuery());
    dispatch(setCurrentTicket({}));
    setHiddenLibDlg(true);
  };
  

  const handleFormField = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    dispatch(
      setCurrentTicket({
        ...ticketActual,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleFormFieldDropdown = (
    e: React.FormEvent<HTMLDivElement>,
    name: any
  ) => {
    dispatch(
      setCurrentTicket({
        ...ticketActual,
        CategoriaId: Number(name.key),
        Categoria: find(categorias, (aut) => aut.Id === Number(name.key)),
      })
    );
  };

  const abrirPanel = () => {
    setHiddenLibDlg(false);
  };
  const cerrarPanel = () => {
    setHiddenLibDlg(true);
  };

  const initColumns = () => {
    setColumns([
      {
        key: "titulo",
        name: "Título",
        fieldName: "Title",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: "descripcion",
        name: "Descripcion",
        fieldName: "Descripcion",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: "categoria",
        name: "Categoria",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: ITicket) => item?.Categoria?.Title,
      },
      {
        key: "estado",
        name: "Estado",
        fieldName: "Estado",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
    ]);
  };

  const init = async () => {
    await handler.init();
    initColumns();
  };

  useEffect(() => {
    initColumns();
  }, [ticketsWithQuery]);

  useEffect(() => {
    init().catch(console.error);
  }, []);

  return (
    <section>
      <h2 className={styles.header}>{title}</h2>
      <PrimaryButton
        text="Nuevo ticket"
        iconProps={{ iconName: "Add" }}
        onClick={abrirPanel}
        className={styles.btn}
      />
      <div>
        {ticketsWithQuery && columns && (
          <DetailsList items={ticketsWithQuery} columns={columns} />
        )}
      </div>
      <Panel
        isOpen={!hiddenLibDlg}
        onDismiss={cerrarPanel}
        onRenderFooterContent={() => (
          <div>
            <PrimaryButton
              text="Guardar"
              iconProps={{ iconName: "Save" }}
              onClick={() => {
                saveTicket().catch(console.error);
              }}
            />
          </div>
        )}
      >
        <TextField
          label={"Titulo"}
          multiline
          rows={3}
          name="Title"
          value={ticketActual?.Title}
          onChange={handleFormField}
        />
        <TextField
          label={"Descripcion"}
          multiline
          rows={3}
          name="Descripcion"
          value={ticketActual?.Descripcion}
          onChange={handleFormField}
        />
        <Dropdown
          label="Categoria"
          options={categorias.map((a) => ({ key: a.Id, text: a.Title }))}
          selectedKey={ticketActual?.CategoriaId}
          onChange={handleFormFieldDropdown}
        />
      </Panel>
    </section>
  );
}
