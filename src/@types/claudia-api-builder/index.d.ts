declare module 'claudia-api-builder' {
  export interface Context {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: {
      cognitoIdentityId: string;
      cognitoIdentityPoolId: string;
    };
    clientContext?: {
      client: {
        installationId: string;
        appTitle: string;
        appVersionName: string;
        appVersionCode: string;
        appPackageName: string;
      };
      Custom?: any;
      env: {
        platformVersion: string;
        platform: string;
        make: string;
        model: string;
        locale: string;
      };
    };

    getRemainingTimeInMillis(): number;

    // Functions for compatibility with earlier Node.js Runtime v0.10.42
    // No longer documented, so they are deprecated, but they still work
    // as of the 12.x runtime, so they are not removed from the types.

    /** @deprecated Use handler callback or promise result */
    done(error?: Error, result?: any): void;
    /** @deprecated Use handler callback with first argument or reject a promise result */
    fail(error: Error | string): void;
    /** @deprecated Use handler callback with second argument or resolve a promise result */
    succeed(messageOrObject: any): void;
    // Unclear what behavior this is supposed to have, I couldn't find any still extant reference,
    // and it behaves like the above, ignoring the object parameter.
    /** @deprecated Use handler callback or promise result */
    succeed(message: string, object: any): void;
  }

  export interface AwsProxy {
    body: string | null;
    headers: { [name: string]: string };
    multiValueHeaders: { [name: string]: string[] };
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    pathParameters: { [name: string]: string } | null;
    queryStringParameters: { [name: string]: string } | null;
    multiValueQueryStringParameters: { [name: string]: string[] } | null;
    stageVariables: { [name: string]: string } | null;
    requestContext: {
      accountId: string;
      apiId: string;
      authorizer:
        | undefined
        | null
        | {
            [name: string]: any;
          };
      connectedAt?: number;
      connectionId?: string;
      domainName?: string;
      domainPrefix?: string;
      eventType?: string;
      extendedRequestId?: string;
      protocol: string;
      httpMethod: string;
      identity: {
        accessKey: string | null;
        accountId: string | null;
        apiKey: string | null;
        apiKeyId: string | null;
        caller: string | null;
        cognitoAuthenticationProvider: string | null;
        cognitoAuthenticationType: string | null;
        cognitoIdentityId: string | null;
        cognitoIdentityPoolId: string | null;
        principalOrgId: string | null;
        sourceIp: string;
        user: string | null;
        userAgent: string | null;
        userArn: string | null;
      };
      messageDirection?: string;
      messageId?: string | null;
      path: string;
      stage: string;
      requestId: string;
      requestTime?: string;
      requestTimeEpoch: number;
      resourceId: string;
      resourcePath: string;
      routeKey?: string;
    };
    resource: string;
    protocol?: string;
  }

  export interface Request {
    v: number;
    rawBody: string;
    normalizedHeaders: { [name: string]: string };
    lambdaContext: Context;
    proxyRequest: AwsProxy;
    env: { [name: string]: string };
    body: object | string | Buffer;
    headers: { [name: string]: string };
    pathParams: { [name: string]: string };
    queryString: { [name: string]: string };
    context: {
      method: RequestClaudiaApiBuilderContextMethod;
      path: string;
      stage: string;
      sourceIp: string;
      accountId: string | null;
      user: string | null;
      userAgent: string | null;
      userArn: string | null;
      caller: string | null;
      apiKey?: string;
      authorizerPrincipalId: string | null;
      cognitoAuthenticationProvider: string | null;
      cognitoAuthenticationType: string | null;
      cognitoIdentityId: string | null;
      cognitoIdentityPoolId: string | null;
    };
  }

  interface ConstructorOptions {
    logger?: Logger;
    prompter?: Prompter;
    mergeVars?: boolean;
    requestFormat?: RequestFormat;
  }

  type Logger = (message?: any, ...messages: any[]) => void;

  type Prompter = (question: string) => Promise<void>;

  type RequestFormat = 'AWS_PROXY' | 'CLAUDIA_API_BUILDER';

  interface ApiConfig {
    version: number;
    routes: ApiConfigRoutes | {};
    corsHandlers?: boolean;
    corsHeaders?: string;
    corsMaxAge?: number;
    authorizers?: ApiConfigAuthorizers;
    binaryMediaTypes: string[];
    customResponses?: ApiConfigCustomResponses;
  }

  interface ApiConfigRoutes {
    [name: string]: { [methods in ApiConfigRoutesMethods]: object };
  }

  type ApiConfigRoutesMethods = 'ANY' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';

  interface ApiConfigAuthorizers {
    [name: string]: RegisterAuthorizerOptions;
  }

  type ApiConfigCustomResponses = {
    [name: string]: SetGatewayResponseConfig;
  };

  type AddPostDeployStepFunction = (
    commandLineOptions: PostDeployOptions,
    lambdaProperties: PostDeployLambdaDetails,
    utils: PostDeployUtils,
  ) => Promise<object | string> | object | string;

  interface PostDeployOptions {
    [key: string]: undefined | string | string[] | number | boolean;
  }

  interface PostDeployLambdaDetails {
    name: string;
    alias: string;
    apiId: string;
    apiUrl: string;
    region: string;
    apiCacheReused: boolean;
  }

  interface PostDeployUtils {
    apiGatewayPromise: any;
    aws: any;
    Promise?: any;
  }

  type RegisterAuthorizerOptions =
    | RegisterAuthorizerOptionsNameVer
    | RegisterAuthorizerOptionsArn
    | RegisterAuthorizerOptionsProviderARNs;

  interface RegisterAuthorizerOptionsNameVer extends RegisterAuthorizerOptionsOptional {
    lambdaName: string;
    lambdaVersion: string | number | boolean;
  }

  interface RegisterAuthorizerOptionsArn extends RegisterAuthorizerOptionsOptional {
    lambdaArn: string;
  }

  interface RegisterAuthorizerOptionsProviderARNs extends RegisterAuthorizerOptionsOptional {
    providerARNs: string[];
  }

  interface RegisterAuthorizerOptionsOptional {
    headerName?: string;
    identitySource?: string;
    validationExpression?: string;
    credentials?: string;
    resultTtl?: number;
    type?: RegisterAuthorizerOptionsOptionalType;
  }

  // If "providerARNs", set to "COGNITO_USER_POOLS". Otherwise set to "TOKEN".
  type RegisterAuthorizerOptionsOptionalType = 'REQUEST' | 'TOKEN' | 'COGNITO_USER_POOLS';

  type SetGatewayResponseType =
    | 'ACCESS_DENIED'
    | 'API_CONFIGURATION_ERROR'
    | 'AUTHORIZER_CONFIGURATION_ERROR'
    | 'AUTHORIZER_FAILURE'
    | 'BAD_REQUEST_PARAMETERS'
    | 'BAD_REQUEST_BODY'
    | 'DEFAULT_4XX'
    | 'DEFAULT_5XX'
    | 'EXPIRED_TOKEN'
    | 'INTEGRATION_FAILURE'
    | 'INTEGRATION_TIMEOUT'
    | 'INVALID_API_KEY'
    | 'INVALID_SIGNATURE'
    | 'MISSING_AUTHENTICATION_TOKEN'
    | 'QUOTA_EXCEEDED'
    | 'REQUEST_TOO_LARGE'
    | 'RESOURCE_NOT_FOUND'
    | 'THROTTLED'
    | 'UNAUTHORIZED'
    | 'UNSUPPORTED_MEDIA_TYPE'
    | 'WAF_FILTERED';

  interface SetGatewayResponseConfig {
    statusCode?: number | string;
    headers?: { [name: string]: string };
    responseParameters?: { [name: string]: string };
    responseTemplates?: { [name: string]: string };
    defaultResponse?: boolean;
  }

  export type Handler = (request: Request | AwsProxy) => Promise<any> | any;

  type RequestClaudiaApiBuilderContextMethod = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

  interface Options {
    error?:
      | number
      | {
          code?: number;
          contentType?: string;
          headers?: { [name: string]: string };
        };
    success?:
      | number
      | {
          code?: number;
          contentType?: string;
          headers?: { [name: string]: string };
          contentHandling?: OptionsContentHandling;
        };
    apiKeyRequired?: boolean;
    authorizationType?: OptionsAuthorizationType;
    invokeWithCredentials?: boolean | string;
    cognitoAuthorizer?: string;
    authorizationScopes?: string[];
    customAuthorizer?: string;
    requestContentHandling?: OptionsContentHandling;
    requestParameters?: {
      querystring?: object;
      header?: object;
    };
  }

  type OptionsContentHandling = 'CONVERT_TO_BINARY' | 'CONVERT_TO_TEXT';

  type OptionsAuthorizationType = 'AWS_IAM';

  export class ApiResponse {
    public constructor(body: string | object, header: object, httpCode: number);
  }

  class ApiBuilder {
    public constructor(options?: ConstructorOptions);

    public apiConfig(): ApiConfig;

    public corsOrigin(handler?: Handler | string): void;

    public corsHeaders(headers: string): void;

    public corsMaxAge(age: number): void;

    public static ApiResponse: typeof ApiResponse;

    public ApiResponse: typeof ApiResponse; // Depreciated.

    public intercept(callback: Handler): void;

    public addPostDeployStep(stepName: string, stepFunction: AddPostDeployStepFunction): void;

    public addPostDeployConfig(stageVarName: string, prompt: string, configOption: string): void;

    public registerAuthorizer(name: string, options: RegisterAuthorizerOptions): void;

    public setBinaryMediaTypes(types?: string[] | boolean): void;

    public setGatewayResponse(responseType: SetGatewayResponseType, config: SetGatewayResponseConfig): void;

    public any(uri: string, callback: Handler, options?: Options): void;

    public get(uri: string, callback: Handler, options?: Options): void;

    public post(uri: string, callback: Handler, options?: Options): void;

    public put(uri: string, callback: Handler, options?: Options): void;

    public delete(uri: string, callback: Handler, options?: Options): void;

    public head(uri: string, callback: Handler, options?: Options): void;

    public patch(uri: string, callback: Handler, options?: Options): void;
  }

  export default ApiBuilder;
}
