import * as React from "react";
import styles from "./Categorias.module.scss";
import ITicket from "@/entities/ITicket";
import useBiblioteca from "@/hooks/useBiblioteca";
import FormTicket from "./FormTicket";
import Peoplepickercontrol from "./ Peoplepickercontrol";
import { useEffect } from "react";
import { DetailsList, IColumn, PrimaryButton, Panel } from "@fluentui/react";
import { find } from "lodash";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface ICategoriaProps {
  title: string;
  context?: WebPartContext;
  Estado?: string;
}

export default function Categorias(props: ICategoriaProps): JSX.Element {
  const { handler, tickets, categorias } = useBiblioteca();
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [curLibro, setCurLibro] = React.useState<ITicket>({} as ITicket);
  const [hiddenLibDlg, setHiddenLibDlg] = React.useState<boolean>(true);

  const editarLibro = (ticket: ITicket) => {
    setCurLibro(find(tickets, (lib) => lib.Id === ticket.Id));
    setHiddenLibDlg(false);
  };
  const guardarTicket = async () => {
    await handler.saveTicket(curLibro);
    setHiddenLibDlg(true);
    setCurLibro({} as ITicket);
  };
  const initColumns = () => {
    setColumns([
      {
        key: "actions",
        name: "Acción",
        minWidth: 200,
        maxWidth: 250,
        isResizable: true,
        onRender: (item: ITicket) => {
          return (
            <div className={styles.containerButton}>
              <PrimaryButton
                text="Atender"
                iconProps={{ iconName: "MobileAngled" }}
                onClick={() => editarLibro(item)}
              />
            </div>
          );
        },
      },
      {
        key: "titulo",
        name: "Titulo",
        fieldName: "Title",
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
      {
        key: "responsable",
        name: "Responsable",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: ITicket) => item?.Responsable?.EMail
      },
    ]);
  };

  const init = async () => {
    await handler.init();
    initColumns();
  };

  useEffect(() => {
    initColumns();
  }, [tickets]);

  useEffect(() => {
    init().catch(console.error);
  }, []);

  const { title } = props;
  // const abrirPanel = () => {
  //   setHiddenLibDlg(false);
  // };
  const cerrarPanel = () => {
    setHiddenLibDlg(true);
  };
  return (
    <section>
      <div className={styles.welcome}>
        <h2>{title}</h2>
      </div>
      <div>
        {tickets && columns && (
          <DetailsList items={tickets} columns={columns} />
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
                guardarTicket().catch(console.error);
              }}
            />
          </div>
        )}
      >
        {/* <FormTicket
          ticket={curLibro}
          context={props.context}
          onChange={(lib: ITicket) => setCurLibro(lib)}
        /> */}
        <Peoplepickercontrol  description={"hola"} context={props.context}/>
      </Panel>
    </section>
  );
}
