import { Context, HttpRequest } from '@azure/functions';
import { advancedHTTPTrigger } from '../triggers';
import { AdvancedHTTPMethod } from '../types';

export const deepClone = (context: Context) => {
  return JSON.parse(JSON.stringify(context));
};

export const defaultHeader: (header?: Partial<HttpRequest>) => HttpRequest = (header: Partial<HttpRequest>) => {
  const headers = {};
  const defHeader: Partial<HttpRequest> = {
    headers: headers,
    query: {},
    method: 'GET',
    url: 'beyond365.de',
    params: {},
    user: null
  };
  return { ...defHeader, ...header } as HttpRequest;
};

const get: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: data
  };
};

const post: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: data
  };
};

export default advancedHTTPTrigger<string>(
  {
    get
  },
  async (context, req) => 'test'
);
