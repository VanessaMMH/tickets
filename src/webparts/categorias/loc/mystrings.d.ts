declare interface ICategoriasWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  CategoriaFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'CategoriasWebPartStrings' {
  const strings: ICategoriasWebPartStrings;
  export = strings;
}
