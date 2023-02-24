import * as React from "react";
import styles from "./Categorias.module.scss";
import ITicket from "@/entities/ITicket";
import { useEffect } from "react";
import useBiblioteca from "@/hooks/useBiblioteca";
import PersonaField from "./PersonaField";
import { DetailsList, IColumn, PrimaryButton } from "@fluentui/react";

import {
  ITheme,
  mergeStyleSets,
  getTheme,
  getFocusStyle,
  List,
  ImageFit,
  Image,
} from "@fluentui/react";
import { sp, Web } from "@pnp/sp/presets/all";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      selectors: {
        "&:hover": { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    overflow: "hidden",
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  ],
  itemIndex: {
    marginBottom: 10,
  },
});

interface ICategoriaProps {
  title: string;
  webURL?: string;
  Estado?: string;
}

export default function Categorias(props: ICategoriaProps): JSX.Element {
  const { handler, tickets } = useBiblioteca();
  const [columns, setColumns] = React.useState<IColumn[]>([]);

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
              />
              {/*
              <DefaultButton
                text="Finalizar"
                iconProps={{ iconName: "CaretSolidAlt" }}
                onClick={() => updateCategoria(item)}
              /> */}
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

  const { title } = props;

  useEffect(() => {
    sp.web.lists
      .getByTitle("Ticket")
      .items.get()
      .then((items) => {
        console.log("mis items", items);
      })
      .catch(console.error);
  }, []);

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
      <PersonaField fieldName="Responsable" />
    </section>
  );
}
