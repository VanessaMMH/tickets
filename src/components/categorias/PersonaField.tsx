import * as React from "react";
// import { sp } from "@pnp/sp";
import { Persona } from "@fluentui/react/lib/Persona";
import { sp } from "@pnp/sp/presets/all";
interface IPersonaFieldProps {
  fieldName: string;
}

interface IPersona {
  imageUrl: string;
  title: string;
  email: string;
}

const PersonaField: React.FunctionComponent<IPersonaFieldProps> = (props) => {
  const [personaData, setPersonaData] = React.useState<IPersona>({
    imageUrl: "",
    title: "",
    email: "",
  });

  React.useEffect(() => {
    sp.web.lists
      .getByTitle("Ticket")
      .items.select(props.fieldName)
      .get()
      .then((items) => {
        const personaFieldValue = items[0][props.fieldName];
        console.log('per',personaFieldValue )
        const personaData: IPersona = {
          imageUrl: personaFieldValue.pictureUrl,
          title: personaFieldValue.title,
          email: personaFieldValue.email,
        };
        setPersonaData(personaData);
      })
      .catch(console.error);
  }, []);

  return (
    <Persona
      imageUrl={personaData.imageUrl}
      text={'hola'}
      secondaryText={personaData.email}
    />
  );
};

export default PersonaField;
