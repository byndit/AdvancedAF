import { Context, HttpRequest } from '@azure/functions';
import { advancedHTTPTrigger } from '../triggers';
import { AdvancedHTTPMethod } from '../types';

export const deepClone = (context: Context) => {
  return JSON.parse(JSON.stringify(context));
};

export const defaultHeader: (header?: Partial<HttpRequest>) => HttpRequest = (header: Partial<HttpRequest>) => {
  const defHeader: HttpRequest = {
    headers: {},
    query: {},
    method: 'GET',
    url: 'beyond365.de',
    params: {}
  };
  return { ...defHeader, ...header };
};


const get: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: data
  }
  context.done()
}

const post: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: data
  }
  context.done()
}


export default advancedHTTPTrigger<string>(
    {
      get
    },
    async (context, req) => 'test'
  );