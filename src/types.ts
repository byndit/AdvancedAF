import { Context, HttpRequest, AzureFunction } from '@azure/functions';

export interface AdvancedHTTPMethods<T> {
  get?: AdvancedHTTPMethod<T>;
  patch?: AdvancedHTTPMethod<T>;
  post?: AdvancedHTTPMethod<T>;
  put?: AdvancedHTTPMethod<T>;
  delete?: AdvancedHTTPMethod<T>;
}

export type AdvancedHTTPMethod<T> = (
  context: Context,
  req: HttpRequest,
  data: T
) => Promise<void>;

export type PreFunction<T> = (context: Context, req: HttpRequest) => Promise<T>

export type AdvancedHTTPTrigger<T> = (pre: PreFunction<T>, methods: AdvancedHTTPMethods<T>) => AzureFunction;


export class AuthError extends Error {
}