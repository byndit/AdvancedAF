import { advancedHTTPTrigger, authenticatedHTTPTrigger } from './../triggers';
import { HttpRequest, HttpMethod } from '@azure/functions';
import { deepClone, defaultHeader } from './helper';
import { AuthError } from '../types';
const context = require('./defaultContext');

test('AdvancedHTTPTrigger string return', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();
  expect.assertions(1);

  let result: string | null = null;
  await advancedHTTPTrigger<string>(
    {
      get: async (context, req, data) => {
        result = data;
        expect(result).toBe('test');
      }
    },
    async (context, req) => 'test'
  )(innerContext, req);
});

test('AdvancedHTTPTrigger string return null', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();
  expect.assertions(1);

  let result = 'test';
  await advancedHTTPTrigger<string>({
    get: async (context, req, data) => {
      result = data;
      expect(result).toBe(null);
    }
  })(innerContext, req);
});

test('UserID given', async () => {
  const innerContext = deepClone(context);
  const username = 'test';
  const req: HttpRequest = defaultHeader({ headers: { ['x-ms-client-principal-id']: username } });
  expect.assertions(1);

  let result: {
    userId: string;
    dataId: string;
  } | null = null;

  await authenticatedHTTPTrigger({
    get: async (context, req, data) => {
      result = data;
      expect(result.userId).toBe(username);
    }
  })(innerContext, req);
});

test('No UserID given', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();
  expect.assertions(1);
  try {
    await authenticatedHTTPTrigger({ get: async (context, req, data) => {} })(innerContext, req);
  } catch (e) {
    expect(e).toEqual(new AuthError());
  }
});

test('Test all methods', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();
  const methods: HttpMethod[] = ['GET', 'POST', 'PATCH', 'DELETE'];
  expect.assertions(4);
  for (let method of methods) {
    let result: string | null = null;
    await advancedHTTPTrigger({
      get: async (context, req, data) => {
        result = 'GET';
        expect(result).toEqual(method);
      },
      post: async (context, req, data) => {
        result = 'POST';
        expect(result).toEqual(method);
      },
      patch: async (context, req, data) => {
        result = 'PATCH';
        expect(result).toEqual(method);
      },
      delete: async (context, req, data) => {
        result = 'DELETE';
        expect(result).toEqual(method);
      }
    })(innerContext, { ...req, method });
  }
});
