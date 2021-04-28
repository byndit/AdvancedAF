import { HttpRequest, Context, AzureFunction } from '@azure/functions';
import { AdvancedHTTPTrigger, AdvancedHTTPMethods, PreFunction, AuthError } from './types';

export function advancedHTTPTrigger<T>(methods: AdvancedHTTPMethods<T>, pre?: PreFunction<T>) {
  return async (context: Context, req: HttpRequest): Promise<void> => {
    let data: T = null;
    if (!!pre) {
      data = await pre(context, req);
    }

    switch (req.method) {
      case 'GET':
        if (!!methods.get) {
          await methods.get(context, req, data);
        }
        break;
      case 'POST':
        if (!!methods.post) {
          await methods.post(context, req, data);
        }
        break;
      case 'PATCH':
        if (!!methods.patch) {
          await methods.patch(context, req, data);
        }
        break;
      case 'DELETE':
        if (!!methods.delete) {
          await methods.delete(context, req, data);
        }
    }
  };
}

export const userId = (context, req) => {
  const userId = req.headers['x-ms-client-principal-id'];
  if (!userId) {
    throw new AuthError();
  }
  return userId;
};

export const dataId = (context, req) => {
  return context.bindingData.id;
};

export const authenticatedHTTPTrigger = (methods: AdvancedHTTPMethods<{ userId: string; dataId: string }>) =>
  advancedHTTPTrigger<{ userId: string; dataId: string }>(methods, async (context, req) => ({
    userId: userId(context, req),
    dataId: dataId(context, req)
  }));
