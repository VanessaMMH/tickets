import * as React from "react";
import styles from "./Categorias.module.scss";
import ITicket from "@/entities/ITicket";
import useBiblioteca from "@/hooks/useBiblioteca";
import FormTicket from "./FormTicket";
import FormTicketResponse from "./FormTicketResponse";
import { useEffect } from "react";
import {
  DetailsList,
  IColumn,
  PrimaryButton,
  DefaultButton,
  Panel,
} from "@fluentui/react";
import { find } from "lodash";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  MessageBar,
  MessageBarType,
  IStackProps,
  Stack,
} from "office-ui-fabric-react";

interface ICategoriaProps {
  title: string;
  context?: WebPartContext;
  Estado?: string;
}

const verticalStackProps: IStackProps = {
  styles: { root: { overflow: "hidden", width: "100%" } },
  tokens: { childrenGap: 20 },
};

export default function Categorias({
  title,
  context,
}: ICategoriaProps): JSX.Element {
  const { handler, tickets } = useBiblioteca();
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [curLibro, setCurLibro] = React.useState<ITicket>({} as ITicket);
  const [showFormResponse, setShowFormResponse] =
    React.useState<boolean>(false);
  const [hiddenLibDlg, setHiddenLibDlg] = React.useState<boolean>(true);
  const [showMessageBar, setShowMessageBar] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [messageType, setMessageType] = React.useState<MessageBarType>();

  const showandhideMessage = (): void => {
    setShowMessageBar(true);
    setTimeout(function () {
      setShowMessageBar(false);
    }, 3000);
  };

  const cerrarPanel = () => {
    setHiddenLibDlg(true);
  };

  const editarLibro = (ticket: ITicket) => {
    setCurLibro(find(tickets, (lib) => lib.Id === ticket.Id));
    setHiddenLibDlg(false);
  };

  const addFormResponse = (ticket) => {
    // console.log('res',ticket)
    setShowFormResponse(true);
    editarLibro(ticket);
    setCurLibro({ ...ticket, Estado: "En Atención" });
  };

  const guardarTicket = async () => {
    try {
      await handler.saveTicket(curLibro);
      setMessage("Item: " + curLibro.Title + " - created successfully!");
      showandhideMessage();
      setMessageType(MessageBarType.success);
      setHiddenLibDlg(true);
      setCurLibro({} as ITicket);
    } catch (error) {
      setMessage(
        "Item " + curLibro.Title + " creation failed with error: " + error
      );
      setShowMessageBar(true);
      setMessageType(MessageBarType.error);
    }
  };

  const initColumns = () => {
    setColumns([
      {
        key: "actions",
        name: "Acción",
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        onRender: (item: ITicket) => {
          return (
            <div className={styles.containerButton}>
              {!item.Responsable && (
                <PrimaryButton
                  text="Asignar"
                  iconProps={{ iconName: "AddFriend" }}
                  onClick={() => editarLibro(item)}
                />
              )}
              {(item.Estado === "Abierto" || item.Estado === "En Atención") && (
                <DefaultButton
                  text="Atender"
                  iconProps={{ iconName: "MobileAngled" }}
                  onClick={() => addFormResponse(item)}
                />
              )}
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
        onRender: (item: ITicket) => item?.Responsable?.Title,
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

  return (
    <section>
      <div className={styles.welcome}>
        <h2>{title}</h2>
      </div>
      {showMessageBar && (
        <div className="form-group">
          <Stack {...verticalStackProps}>
            <MessageBar messageBarType={messageType}>{message}</MessageBar>
          </Stack>
        </div>
      )}
      <div>
        {tickets && columns && (
          <DetailsList
            items={tickets.filter((ticket) => ticket.Estado !== "Atendido")}
            columns={columns}
          />
        )}
      </div>
      <Panel
        isOpen={!hiddenLibDlg}
        onDismiss={cerrarPanel}
        onRenderFooterContent={() => (
          <PrimaryButton
            text={showFormResponse ? "Finalizar Atención" : "Guardar"}
            iconProps={{ iconName: "Save" }}
            onClick={() => {
              guardarTicket().catch(console.error);
            }}
          />
        )}
      >
        {showFormResponse ? (
          <FormTicketResponse
            ticket={curLibro}
            context={context}
            onChange={(lib: ITicket) => setCurLibro(lib)}
          />
        ) : (
          <FormTicket
            ticket={curLibro}
            context={context}
            onChange={(lib: ITicket) => setCurLibro(lib)}
          />
        )}
      </Panel>
    </section>
  );
}
