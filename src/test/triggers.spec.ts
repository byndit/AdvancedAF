import { advancedHTTPTrigger, authenticatedHTTPTrigger } from './../triggers';
import { Context, HttpRequest, HttpMethod } from '@azure/functions';
import { deepClone, defaultHeader } from './helper';
import { AuthError } from '../types';
import { Http2ServerRequest } from 'http2';
const context = require('./defaultContext');

test('AdvancedHTTPTrigger string return', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();

  let result = null;
  await advancedHTTPTrigger<string>(
    {
      get: async (context, req, data) => {
        result = data;
      }
    },
    async (context, req) => 'test'
  )(innerContext, req);
  expect(result).toBe('test');
});

test('AdvancedHTTPTrigger string return', async () => {
  const innerContext = deepClone(context);
  const req: HttpRequest = defaultHeader();

  let result = 'test';
  await advancedHTTPTrigger<string>({
    get: async (context, req, data) => {
      result = data;
    }
  })(innerContext, req);
  expect(result).toBe(null);
});

test('UserID given', async () => {
  const innerContext = deepClone(context);
  const username = 'test';
  const req: HttpRequest = defaultHeader({ headers: { ['x-ms-client-principal-id']: username } });

  let result = null;
  await authenticatedHTTPTrigger({
    get: async (context, req, data) => {
      result = data;
    }
  })(innerContext, req);
  expect(result.userId).toBe(username);
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
  for (let method of methods) {
    let result = null;
    await advancedHTTPTrigger({
      get: async (context, req, data) => {
        result = 'GET';
      },
      post: async (context, req, data) => {
        result = 'POST';
      },
      patch: async (context, req, data) => {
        result = 'PATCH';
      },
      delete: async (context, req, data) => {
        result = 'DELETE';
      }
    })(innerContext, { ...req, method });
    expect(result).toEqual(method);
  }
});
