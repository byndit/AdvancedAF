# AdvancedAF
This project is ment to be used with Microsoft Azure Functions.
This simple wrapper makes it easier to work with Azure Functions since common HTTP methods are wrapped to individual function calls within a specfic Azure Function. And in addition a function can be executed before each method will be executed.

# Usage example
In the following example a get and a post function a defined and passed as parameters in the advancedHTTPtrigger Function. The first optional parameter can be given a function which is executed before ether the get or post functions will be executed. The return value will be injected as the data parameter in each function. 

If you now call that function using the GET method you will see the response `GET: test` and via the POST method you will see `POST: test`. 
```typescript
const get: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: 'GET: ' + data
  }
  context.done()
}

const post: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: String) => {
  context.res = {
    body: 'POST: ' + data
  }
  context.done()
}


export default advancedHTTPTrigger<string>(
    { get, post },
    async (context, req) => 'test'
);
```

# Additional usage example
There is a another function, that helps with authentication in Azure Functions. If authentication is setup properly, one can check the `x-ms-client-principal-id` which will contain the "userId" if the user authenticated successfully. 

In the example below the get function will only be executed if the user was successfully authenticated. 

```typescript
const get: AdvancedHTTPMethod<string> = async (context: Context, req: HttpRequest, data: { userId: string; dataId: string }) => {
  context.res = {
    body: data
  }
  context.done()
}

export default authenticatedHTTPTrigger(
    { get }
);
```
