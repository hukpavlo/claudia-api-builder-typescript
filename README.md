# claudia-api-builder-typescript

## Simple example

```javascript
import { BaseApi, Controller, Middlewares, Get } from 'claudia-api-builder-typescript';

@Controller('/users')
class UsersController {
  @Get()
  @Middlewares([req => console.log(req.body), req => console.log(req.pathParams)])
  getAllUsers() {
    return { message: 'All users!' };
  }
}

class Api extends BaseApi {
  getControllers() {
    return [new UsersController()];
  }
}

export = new Api().apiBuilder;
```
