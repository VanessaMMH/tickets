import { PrincipalSource, RoleType } from "@pnp/sp/presets/all";
import { SPHttpClient } from "@microsoft/sp-http";
import IPeoplePicker from "@/entities/IPeoplePicker";
import IBaseItem from "@/entities/IBaseItem";
import * as React from "react";
import { IPeoplepickercontrolProps } from "@/entities/IPeoplepickercontrolProps";
// import { IPeoplepickercontrolState } from "@/entities/IPeoplepickercontrolState";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  MessageBar,
  MessageBarType,
  IStackProps,
  Stack,
} from "office-ui-fabric-react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import useBiblioteca from "@/hooks/useBiblioteca";

const verticalStackProps: IStackProps = {
  styles: { root: { overflow: "hidden", width: "100%" } },
  tokens: { childrenGap: 20 },
};

const Peoplepickercontrol: React.FC<IPeoplepickercontrolProps> = (
  props: IPeoplepickercontrolProps
) => {
  const { handler } = useBiblioteca();

  const [title, setTitle] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [id, setId] = React.useState<IBaseItem>(null);
  const [users, setUsers] = React.useState<any[]>([]);
  const [showMessageBar, setShowMessageBar] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [messageType, setMessageType] = React.useState<MessageBarType>();

  React.useEffect(() => {
    sp.setup({ spfxContext: props.context as any });
  }, [props.context]);

  const getUserByEmail = async (email) => {
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

  const _getPeoplePickerItems = async(user: IPeoplePicker[]) => {
    setEmail(user[0].secondaryText);
    console.log('email',email)
    const person = await getUserByEmail(email)
    return person
  };

  const handleGetPeoplePickerItems = React.useCallback((items: any[]) => {
    const getSelectedUsers = [];

    for (const item of items) {
      getSelectedUsers.push(items[item].id);
    }
    setUsers(getSelectedUsers);
  }, []);

  const handleOnChangedTitle = React.useCallback((title: string) => {
    setTitle(title);
  }, []);

  const handleCreateItem = React.useCallback(async () => {
    try {
      await sp.web.lists.getByTitle("Ticket").items.add({
        Title: "asd",
        Responsable: "vmacedo@ejbcsandbox.onmicrosoft.com",
      });

      setMessage("Item: " + title + " - created successfully!");
      setShowMessageBar(true);
      setMessageType(MessageBarType.success);
    } catch (error) {
      setMessage("Item " + title + " creation failed with error: " + error);
      setShowMessageBar(true);
      setMessageType(MessageBarType.error);
    }
  }, [title, users]);

  return (
    <div>
      {showMessageBar ? (
        <div className="form-group">
          <Stack {...verticalStackProps}>
            <MessageBar messageBarType={messageType}>{message}</MessageBar>
          </Stack>
        </div>
      ) : null}
      <TextField label="Title" required onChange={() => handleOnChangedTitle} />
      <PeoplePicker
        context={props.context as any}
        titleText="Project Members"
        personSelectionLimit={1}
        showtooltip={true}
        disabled={false}
        onChange={_getPeoplePickerItems}
        showHiddenInUI={false}
        ensureUser={true}
        principalTypes={[PrincipalType.User]}
        resolveDelay={1000}
      />
      <DefaultButton
        text="Submit"
        // onClick={() => getUserByEmail("vmacedo@ejbcsandbox.onmicrosoft.com")}
      />
    </div>
  );
};

export default Peoplepickercontrol;

// import * as React from "react";
// import { IPeoplepickercontrolProps } from "@/entities/IPeoplepickercontrolProps";
// import { IPeoplepickercontrolState } from "@/entities/IPeoplepickercontrolState";
// import { DefaultButton } from "office-ui-fabric-react/lib/Button";
// import { TextField } from "office-ui-fabric-react/lib/TextField";
// import {
//   MessageBar,
//   MessageBarType,
//   IStackProps,
//   Stack,
// } from "office-ui-fabric-react";
// import {
//   PeoplePicker,
//   PrincipalType,
// } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { sp } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";

// const verticalStackProps: IStackProps = {
//   styles: { root: { overflow: "hidden", width: "100%" } },
//   tokens: { childrenGap: 20 },
// };

// const Peoplepickercontrol: React.FunctionComponent<
//   IPeoplepickercontrolProps
// > = (props: IPeoplepickercontrolProps) => {
//   const [title, setTitle] = React.useState("");
//   const [users, setUsers] = React.useState([]);
//   const [showMessageBar, setShowMessageBar] = React.useState(false);
//   const [message, setMessage] = React.useState("");
//   const [messageType, setMessageType] = React.useState(MessageBarType.success);

//   const getPeoplePickerItems = (items: any[]) => {
//     const getSelectedUsers = [];
//     for (const item of items) {
//       getSelectedUsers.push(items[item].id);
//     }
//     setUsers(getSelectedUsers);
//   };

//   const onTitleChanged = (title: string) => {
//     setTitle(title);
//   };

//   const createItem = async () => {
//     try {
//       await sp.web.lists.getByTitle("Ticket").items.add({
//         Title: title,
//         ResponsableId: users,
//       });
//       setMessage(`Item: ${title} - created successfully!`);
//       setShowMessageBar(true);
//       setMessageType(MessageBarType.success);
//     } catch (error) {
//       setMessage(`Item ${title} creation failed with error: ${error}`);
//       setShowMessageBar(true);
//       setMessageType(MessageBarType.error);
//     }
//   };

//   return (
//     <div>
//       {showMessageBar && (
//         <div className="form-group">
//           <Stack {...verticalStackProps}>
//             <MessageBar messageBarType={messageType}>{message}</MessageBar>
//           </Stack>
//         </div>
//       )}
//       <TextField label="Title" required onChange={() => onTitleChanged} />
//       <PeoplePicker
//         context={props.context as any}
//         titleText="Project Members"
//         personSelectionLimit={3}
//         showtooltip={true}
//         disabled={false}
//         onChange={getPeoplePickerItems}
//         showHiddenInUI={false}
//         ensureUser={true}
//         principalTypes={[PrincipalType.User]}
//         resolveDelay={1000}
//       />
//       <DefaultButton text="Submit" onClick={createItem} />
//     </div>
//   );
// };

// export default Peoplepickercontrol;

// import * as React from 'react';
// import { IPeoplepickercontrolProps } from '@/entities/IPeoplepickercontrolProps';
// import { IPeoplepickercontrolState } from '@/entities/IPeoplepickercontrolState';
// import {  DefaultButton } from 'office-ui-fabric-react/lib/Button';
// import { TextField } from 'office-ui-fabric-react/lib/TextField';
// import { MessageBar, MessageBarType, IStackProps, Stack } from 'office-ui-fabric-react';
// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { sp } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";

// const verticalStackProps: IStackProps = {
//   styles: { root: { overflow: 'hidden', width: '100%' } },
//   tokens: { childrenGap: 20 }
// };

// export default class Peoplepickercontrol extends React.Component<IPeoplepickercontrolProps, IPeoplepickercontrolState> {
//   constructor(props: IPeoplepickercontrolProps, state: IPeoplepickercontrolState) {
//     super(props);
//     sp.setup({
//       spfxContext: this.props.context  as any
//     });

//     this.state = {
//       title: '',
//       users: [],
//       showMessageBar: false
//     };

//   }
//   public render(): React.ReactElement<IPeoplepickercontrolProps> {
//     return (
//       <div >
//         {
//           this.state.showMessageBar
//             ?
//             <div className="form-group">
//               <Stack {...verticalStackProps}>
//                 <MessageBar messageBarType={this.state.messageType}>{this.state.message}</MessageBar>
//               </Stack>
//             </div>
//             :
//             null
//         }
//         <TextField label="Title" required onChange={()=>this._onchangedTitle} />
//         <PeoplePicker
//           context={this.props.context as any}
//           titleText="Project Members"
//           personSelectionLimit={3}
//           showtooltip={true}
//         //   isRequired={true}
//           disabled={false}
//           onChange={this._getPeoplePickerItems}
//           showHiddenInUI={false}
//           ensureUser={true}
//           principalTypes={[PrincipalType.User]}
//           resolveDelay={1000} />
//         <DefaultButton text="Submit" onClick={this._createItem} />
//       </div>
//     );
//   }

//   // @autobind
//   private _getPeoplePickerItems=(items: any[])=> {
//     const getSelectedUsers = [];
//     for (const item of items) {
//         getSelectedUsers.push(items[item].id);

//     }

//     this.setState({ users: getSelectedUsers });
//   }

//   private _onchangedTitle=(title: string)=> {
//     this.setState({ title: title });
//   }

//   private _createItem=async ()=> {
//     try {
//       console.log('state', this.state)
//       await sp.web.lists.getByTitle("Ticket").items.add({
//         Title: "hola",
//         ResponsableId:  10

//       });

//       this.setState({
//         message: "Item: " + this.state.title + " - created successfully!",
//         showMessageBar: true,
//         messageType: MessageBarType.success
//       });

//     }
//     catch (error) {
//       this.setState({
//         message: "Item " + this.state.title + " creation failed with error: " + error,
//         showMessageBar: true,
//         messageType: MessageBarType.error
//       });
//     }
//   }
// }
