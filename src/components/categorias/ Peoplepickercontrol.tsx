import * as React from 'react';  
// import styles from './Peoplepickercontrol.module.scss';  
import { IPeoplepickercontrolProps } from '@/entities/IPeoplepickercontrolProps';  
import { IPeoplepickercontrolState } from '@/entities/IPeoplepickercontrolState';  
import {  DefaultButton } from 'office-ui-fabric-react/lib/Button';  
import { TextField } from 'office-ui-fabric-react/lib/TextField';  
// import { autobind } from 'office-ui-fabric-react';  
import { MessageBar, MessageBarType, IStackProps, Stack } from 'office-ui-fabric-react';  
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";  
import { sp } from "@pnp/sp";  
import "@pnp/sp/webs";  
import "@pnp/sp/lists";  
import "@pnp/sp/items";  
  
const verticalStackProps: IStackProps = {  
  styles: { root: { overflow: 'hidden', width: '100%' } },  
  tokens: { childrenGap: 20 }  
};  
  
export default class Peoplepickercontrol extends React.Component<IPeoplepickercontrolProps, IPeoplepickercontrolState> {  
  constructor(props: IPeoplepickercontrolProps, state: IPeoplepickercontrolState) {  
    super(props);  
    sp.setup({  
      spfxContext: this.props.context  as any
    });  
  
    this.state = {  
      title: '',  
      users: [],  
      showMessageBar: false  
    }; 
   
  }  
  public render(): React.ReactElement<IPeoplepickercontrolProps> {  
    return (  
      <div >  
        {  
          this.state.showMessageBar  
            ?  
            <div className="form-group">  
              <Stack {...verticalStackProps}>  
                <MessageBar messageBarType={this.state.messageType}>{this.state.message}</MessageBar>  
              </Stack>  
            </div>  
            :  
            null  
        }  
        <TextField label="Title" required onChange={()=>this._onchangedTitle} />  
        <PeoplePicker  
          context={this.props.context as any}  
          titleText="Project Members"  
          personSelectionLimit={3}  
          showtooltip={true}  
        //   isRequired={true}  
          disabled={false}  
          onChange={this._getPeoplePickerItems}  
          showHiddenInUI={false}  
          ensureUser={true}  
          principalTypes={[PrincipalType.User]}  
          resolveDelay={1000} />  
        <DefaultButton text="Submit" onClick={this._createItem} />  
      </div>  
    );  
  }  
  
  // @autobind  
  private _getPeoplePickerItems=(items: any[])=> {  
    const getSelectedUsers = [];  
    for (const item of items) {
        getSelectedUsers.push(items[item].id);  

    }
    // for (let item in items) {  
    //   getSelectedUsers.push(items[item].id);  
    // }  
    this.setState({ users: getSelectedUsers });  
  }  
  
  // @autobind  
  private _onchangedTitle=(title: string)=> {  
    this.setState({ title: title });  
  }  
  
  // @autobind  
  private _createItem=async ()=> {  
    try {  
      console.log('state', this.state) 
      await sp.web.lists.getByTitle("Ticket").items.add({ 
        Title: "hola",  
        ResponsableId:  10 
  
      });  
  
      this.setState({  
        message: "Item: " + this.state.title + " - created successfully!",  
        showMessageBar: true,  
        messageType: MessageBarType.success  
      });  
  
    }  
    catch (error) {  
      this.setState({  
        message: "Item " + this.state.title + " creation failed with error: " + error,  
        showMessageBar: true,  
        messageType: MessageBarType.error  
      });  
    }  
  }  
}    