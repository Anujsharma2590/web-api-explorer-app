// src/types/apiTypes.ts

export interface ProviderListResponse {
    data: string[];
  }
  
  export interface APIInfo {
    version: string;
    'x-release': string;
    title: string;
    description: string;
    'x-logo': {
      url: string;
      backgroundColor: string;
    };
    termsOfService: string;
    contact: {
      name: string;
      email: string;
      url: string;
      'x-twitter': string;
    };
    license: {
      name: string;
      url: string;
    };
    'x-providerName': string;
    'x-serviceName': string;
    'x-origin': Array<{
      contentType: string;
      url: string;
      converter: {
        url: string;
        version: string;
      };
      'x-apisguru-driver': string;
    }>;
    'x-apiClientRegistration': {
      url: string;
    };
    'x-apisguru-categories': string[];
    'x-preferred': boolean;
  }
  
  export interface APIItem {
    [key: string]: {
      added: string;
      info: APIInfo;
      externalDocs: {
        description: string;
        url: string;
      };
      updated: string;
      swaggerUrl: string;
      swaggerYamlUrl: string;
      openapiVer: string;
      link: string;
    };
  }
  
  export interface ProviderAPIsResponse {
    apis: APIItem;
  }
  