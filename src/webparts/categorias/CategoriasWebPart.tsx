import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CategoriasWebPartStrings';
import Categorias from '../../components/categorias/Categorias';
import { initialize } from '@api/dataservice';
import { store } from '@/store/store';
import { Provider } from 'react-redux';


export interface ICategoriasWebPartProps {
  title: string;
  webURL:string

}
export interface ICustomWebPartProps {
  textValue: string;
}

export default class CategoriasWebPart extends BaseClientSideWebPart<ICategoriasWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private generateURL() {
    const currentValue = this.properties.title;
    const queryString = `?textValue=${currentValue}`;
    const url = this.context.pageContext.web.absoluteUrl + `/_layouts/15/workbench.aspx${queryString}`;
    return url;
  }

  public render(): void {
    const element:JSX.Element = (
      <Provider store={store}>
        <Categorias title={this.properties.title}  webURL={this.context.pageContext.web.absoluteUrl}
 />
      </Provider>);

    ReactDom.render(element, this.domElement);
  }
  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    await initialize(this.context);

    return super.onInit();
  }


  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }


  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.CategoriaFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
