![logo](../../shared/static/imgs/logo-kealm.png)

# Egg.js

## What's Egg.js

Egg.js 是基于 Koa

Koa 自身不提供 session、视图模板、路由、文件上传、日志管理等，必要时都需自行去找中间件 Middleware

Egg.js 解决了上述问题，且将多进程启动，开发时的热更新等问题一并解决了，这对开发者很友好，开箱即用，更像一个企业级框架

总的来说，Egg.js 相比于 Koa/Express：

- 有着 MVC 代码开发模式

- 有创建/扩展机制

- [多线程管理](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)

- HttpClient 集成

## 项目创建 + 启动

```sh
# 创建项目
npm init egg --type=ts

# 开发环境使用
npm run dev

# 生产环境使用，不会占用窗口命令行，需 stop 停止
npm run start
npm run stop
```

## 新建路由页面

Controller 一般可以用于：

- RESTful Controller 作为服务端接口
- HTML 渲染页面
- 代理服务器

下面以第 2 种场景示例

```ts
// 新建 app/controller/about.ts
import { Controller } from 'egg';

function sleep(delay = 1000): Promise<void> {
    return new Promise(r => {
        setTimeout(r, delay);
    });
}

export default class AboutController extends Controller {
    public async index() {
        const { ctx } = this;
        const text = await ctx.service.test.sayHi('about');
        await sleep();
        ctx.body = text;
    }
}

```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);
    // 新增路由
    router.get('/about', controller.about.index);
};

// 访问 /about 即可
```

```ts
// 编写单元测试
// test/app/controller/about.test.ts
import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/about.test.ts', () => {
    it('should GET /about', async () => {
        const result = await app.httpRequest().get('/about').expect(200);
        assert(result.text === 'hi, about');
    });
});

// npm run test-local 运行测试（可能需要先关闭项目？不然 server 会占用着 log 文件，单测出错往 common-error 写的时候会出错）
```

## 动态编译 typings

在上例编写过程中会发现，不论是 `services` 还是 `controller`，编写后会自动有 typescript 类型识别（如 controller. 的时候会自动识别出 about）

这是因为 Egg.js 在运行时会自动编译所有文件，生成在 `typings` 文件夹中

并利用 `declare module 'egg'` 进行对 egg 中的类型进行扩展

```ts
// node_modules/egg/index.d.ts
declare module 'egg' {
    // .....
    export interface IController extends PlainObject { } // tslint:disable-line
}
```

```ts
// typings/app/controller/index.d.ts
// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAbout from '../../../app/controller/about';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
    interface IController {
        about: ExportAbout;
        home: ExportHome;
    }
}
```

## Get 请求

有 `query` 与 `params` 两种接收参数的方式

```ts
// app/controller/about.ts
import { Controller } from 'egg';

export default class AboutController extends Controller {
    public async getUser() {
        const { ctx } = this;
        ctx.body = { ...ctx.query, id: ctx.params.id };
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/getUser/:id', controller.about.getUser);
};

// 访问 /getUser/1?name=karmiy
```

## Post 请求

```ts
// app/controller/about.ts
import { Controller } from 'egg';

export default class AboutController extends Controller {
    public async addUser() {
        const { ctx } = this;

        ctx.body = {
            status: 200,
            data: ctx.request.body,
        };
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.post('/addUser', controller.about.addUser);
};
```

为了测试 post 请求，可以使用 VSCode 插件 `REST Client` 发请求

```ts
// 因为 Egg.js 自带防护，需要关闭本地 csrf，否则请求会 403
// config/config.local.ts
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    // dev close csrf
    config.security = {
        csrf: {
            enable: false,
        },
    };

    return config;
};
```

```sh
# 新建 rest-client/post-base.http
POST http://127.0.0.1:7001/addUser
Content-Type: application/json

{
    "name": "karmiy",
    "age": 18
}

# 右键该文件，选择 Send Request 即可看到请求结果了
```

## Service

可以理解为：

- Controller 是写业务逻辑的
- Service 是封装抽象层，如数据库交互代码
  - 保持 Controller 逻辑更简洁
  - 独立性，Service 应用在不同 Controller
  - 独立测试

```ts
// 新建 app/service/User.ts
import { Service } from 'egg';

/**
 * User Service
 */
export default class User extends Service {
    private users = [
        { id: 1, name: 'karmiy' },
        { id: 2, name: 'karloy' },
        { id: 3, name: 'kealm' },
    ];
    
    public async mockGet(id: number) {
        return this.users.find(item => item.id === id);
    }
}
```

```ts
// 新建 app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    public async getUser() {
        const { ctx } = this;

        const id = ctx.query.id ?? ctx.params.id;

        if (!id) {
            ctx.body = {};
            return;
        }

        const user = await ctx.service.user.mockGet(Number(id));
        ctx.body = user ?? {};
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/getMockUser/:id', controller.user.getMockUser);
};

// 访问 /getMockUser/1
// 访问 /getMockUser/2
// 访问 /getMockUser/3
```

## 模板引擎

> Egg.js 约定 render 资源在 app/view 文件夹

这里使用 EJS 作为模板引擎做服务端渲染

```sh
# 安装 ejs 插件
npm install --save egg-view-ejs
```

```ts
// 配置 config/plugin.ts
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    ejs: {
        enable: true,
        package: 'egg-view-ejs',
    },
};

export default plugin;

// 配置 cofig/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    // ...

    // ejs template
    config.view = {
        mapping: {
            '.html': 'ejs', // 所有 .html 都用 ejs 解析
        },
    };

    config.ejs = {
        // delimiter: '$', // ejs 解析是以 % 为分界，如 <%= xxx %>，如果不想要 %，可以这样配置，如 % 换 $
    };

    return {
        ...config,
        ...bizConfig,
    };
};
```

```html
<!-- 新建 app/view/demo-1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
</head>
<body>
    <h1>This is Demo1</h1>
    <p>user id: <%= id %></p>
    <p>user name: <%= name %></p>
    <p>user tags:</p>
    <ul>
        <% for(var i = 0; i < tags.length; i++) { %>
            <li><%= tags[i] %></li>
        <% } %>
    </ul>
</body>
</html>
```

```ts
// 新建 app/controller/ejs.ts
import { Controller } from 'egg';

export default class EjsController extends Controller {
    public async index() {
        const { ctx } = this;

        await ctx.render('demo-1.html', {
            id: 1,
            name: 'karmiy',
            tags: [
                'tag1',
                'tag2',
                'tag3',
            ],
        });
    }
}

// 配置 app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/ejs', controller.ejs.index);
};

// 访问 /ejs 即可
```

### include 其他模板

```html
<!-- 新建 app/view/header.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
</head>
<body>
    <!-- 也可以整个文件只有这部分，上面 <html> 什么的都不要 -->
    <h1>This is Header</h1>
</body>
</html>
```

```html
<!-- app/view/demo-1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
</head>
<body>
    <% include header.html %>
    <p>user id: <%= id %></p>
    <p>user name: <%= name %></p>
    <p>user tags:</p>
    <ul>
        <% for(var i = 0; i < tags.length; i++) { %>
            <li><%= tags[i] %></li>
        <% } %>
    </ul>
</body>
</html>
```

### 静态资源

> Egg.js 约定静态资源在 app/public 文件夹

```css
/* 新建 app/public/default.css */
/* 可以 /public/default.css 访问到 */
body {
    margin: 0;
}
```

```ts
// 如果不想用默认 Egg.js 约定的 public，也可以自定义
// cofig/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    // ...

    config.static = {
        // prefix: '/assets/', // 不建议这么做
    };

    return {
        ...config,
        ...bizConfig,
    };
};
```

```html
<!-- app/view/demo-1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
    <!-- 引入 css -->
    <link rel="stylesheet" href="/public/default.css">
</head>
<body>
    <% include header.html %>
    <p>user id: <%= id %></p>
    <p>user name: <%= name %></p>
    <p>user tags:</p>
    <ul>
        <% for(var i = 0; i < tags.length; i++) { %>
            <li><%= tags[i] %></li>
        <% } %>
    </ul>
</body>
</html>
```

## Cookie

```ts
// 新建 app/controller/cookie.ts
import { Controller } from 'egg';

export default class CookieController extends Controller {
    public async add() {
        const { ctx } = this;

         // 增/改
        ctx.cookies.set('user', 'XDS 7n9jxxxxx', {
            // maxAge: 1000 * 2, // 2s 时效
            // httpOnly: false, // true 即通过 js 脚本无法读取 cookie 信息，只允许在服务端操作，在浏览器控制台打印 document.cookie 会发现没有。设为 false 的话才可以访问到
            // encrypt: true, // 加密，否则 cookies.set 无法设置 value 是中文，不过拿的时候需要
        });
        
         // 删
        // ctx.cookies.set('user', null);
        
        // 查
        ctx.cookies.get('user', {
            // encrypt: true, // 如果 set 设置了 encrypt，get 的时候也需要设置
        })
        
        ctx.body = {
            status: 200,
            data: '成功',
        };
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;
    router.post('/cookie/add', controller.cookie.add);
};
```

```html
<!-- app/view/demo-1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
</head>
<body>
    <button onclick="addCookie()">Add Cookie</button>
    <script>
        function addCookie() {
            fetch('/cookie/add', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
            });
        }
    </script>
</body>
</html>
```

## Session

```ts
// 新建 app/controller/session.ts
import { Controller } from 'egg';

export default class SessionController extends Controller {
    public async add() {
        const { ctx } = this;

        ctx.session.userName = 'karmiy';
        // console.log(ctx.session.userName);

        ctx.body = {
            status: 200,
            data: '成功',
        };
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;
    router.post('/session/add', controller.session.add);
};
```

```html
<!-- app/view/demo-1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo-1</title>
</head>
<body>
    <button onclick="addSession()">Add Session</button>
    <script>
        function addSession() {
            fetch('/session/add', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
            });
        }
    </script>
</body>
</html>
```

访问后也会在浏览器 Application 看到键为 `EGG_SESS` 的 cookie，如果希望自定义这个 key，或对 session 进行统一配置：

```ts
// config/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // ...
    // session
    config.session = {
        // key: 'KEALM_SESS',
        // httpOnly: false,
        // maxAge: 1000 * 30,
        // renew: true, // 访问页面会重新刷 30s
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
```

## 中间件

可以用于开发全局计数器、全局页面 gzip 压缩，全局埋点、全局访问 ip 统计

> Egg.js 约定中间件在 middleware 文件夹

如下开发一个全局计数器：

```ts
// 新建 app/middleware/counter.ts
import { Context, Application, EggAppConfig } from 'egg';

export default function CounterMiddleware(options: EggAppConfig, app: Application) {
    console.log(options, app);
    
    return async (ctx: Context, next: () => Promise<any>) => {
        // 把 session.counter 每次 ++
        if (ctx.session.counter) {
            ctx.session.counter++;
        } else {
            ctx.session.counter = 1;
        }
        await next();
    };
}
```

### 全局配置

```ts
// config/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    // ...

    // add your egg config in here
    config.middleware = [ 'counter' ];
    
    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
```

```ts
// 随便找个 controller
// app/controller/about.ts
import { Controller } from 'egg';

function sleep(delay = 1000): Promise<void> {
    return new Promise(r => {
        setTimeout(r, delay);
    });
}

export default class AboutController extends Controller {
    public async index() {
        const { ctx } = this;

        // 打印，访问可以在 vscode 控制台看到
        console.log('ctx.session.counter', ctx.session.counter);
        const text = await ctx.service.test.sayHi('about');
        await sleep();
        ctx.body = text;
    }
}
```

> 注：在 config/config.default.ts 配置后，每个路径（随便一个 controller 路径，而不是如上访问了的 controller 才会有效）访问，都会触发中间件，也就是说访问了 /about 后，变成 1，再访问别的地址，再回来访问 /about，会变成 3，因为访问别的地址

### 局部配置

如果只希望指定 controller 起作用：

```ts
// config/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    // ...

    // 移除
    // config.middleware = [ 'counter' ];
    
    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, middleware } = app;

    const counterMiddleware = middleware.counter();

    // 只在 /about 起作用
    router.get('/about', counterMiddleware, controller.about.index);
};
```

## Extend 扩展对象

Egg.js 可以对内部的五种对象进行扩展

|             | 说明                                       | this 指向         | 使用方式          |
| ----------- | ------------------------------------------ | ----------------- | ----------------- |
| application | 全局应用对象                               | app 对象          | this.app          |
| context     | 请求上下文                                 | ctx 对象          | this.ctx          |
| request     | 请求级别的对象，提供了请求相关的属性和方法 | ctx.request 对象  | this.ctx.request  |
| response    | 响应级别的对象，提供了响应相关的属性和方法 | ctx.response 对象 | this.ctx.response |
| helper      | 帮助函数                                   | ctx.helper 对象   | this.ctx.helper   |

> Egg.js 约定扩展对象在 app/extend 文件夹，且文件名为扩展对象对应

### application

为 application 扩展 `getCurrentTime` 方法

```ts
// app/extend/application.ts
export default {
    getCurrentTime() {
        return new Date().toLocaleString();
    },
    get currentTime() {
        return this.getCurrentTime();
    },
};
```

```ts
// app/controller/extend.ts
import { Controller } from 'egg';

export default class ExtendController extends Controller {
    public async application() {
        const { ctx, app } = this;
        // ctx.body = { currentTime: app.getCurrentTime() };
        ctx.body = { currentTime: app.currentTime };
    }
}

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
    
  router.get('/extend/application', controller.extend.application);
};
```

### context

`get` 与 `post` 获取参数的方式不同，有时可能希望用统一的方式获取

可以为 context 扩展 `getParams` 方法

```ts
// app/extend/context.ts
import { Context, PlainObject } from 'egg';

function getParams(this: Context): PlainObject<string> | undefined;
function getParams(this: Context, key: string): string | undefined;
function getParams(this: Context, key?: string) {
    const { method } = this.request;

    switch (method) {
        case 'GET':
            return key ? this.query[key] : this.query;
        case 'POST':
            return key ? this.request.body[key] : this.request.body;
        default:
            return;
    }
}

export default {
    getParams,
};
```

```ts
// app/controller/extend.ts
import { Controller } from 'egg';

export default class ExtendController extends Controller {
    public async context() {
        const { ctx } = this;
        ctx.body = { params: ctx.getParams(), id: ctx.getParams('id') };
    }
}
```

```ts
/* -------------------- 测试 GET -------------------- */

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
    
  router.get('/extend/context', controller.extend.context);
};

// 访问 /extend/context?id=1 即可看到输出
```

```ts
/* -------------------- 测试 POST -------------------- */

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
    
  router.post('/extend/context', controller.extend.context);
};

// 新建 REST client 文件，右键 Send Request 发起 post 请求
// rest-client/extend-context.http
POST http://127.0.0.1:7001/extend/context
Content-Type: application/json

{
    "id": 1,
    "name": "karmiy",
    "age": 18
}
```

### request

为 request 扩展一个 `token` 字段来获取请求中 headers 携带的 token

```ts
// app/extend/request.ts
import { Request } from 'egg';

export default {
    get token() {
        return (this as Request).get('token');
    },
};
```

```ts
// app/controller/extend.ts
import { Controller } from 'egg';

export default class ExtendController extends Controller {
    public async request() {
        const { ctx } = this;
        ctx.body = { status: 200, token: ctx.request.token };
    }
}

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.post('/extend/request', controller.extend.request);
};
```

```ts
// 新建 rest-client/extend-request.http
// 右键 Send Request 发起 post 请求
POST http://127.0.0.1:7001/extend/request
Content-Type: application/json
token: XDS 7n9jxxxxx
```

### response

为 response 扩展一个 `setToken` 方法

```ts
// app/extend/response.ts
import { Response } from 'egg';

export default {
    setToken(this: Response, token: string) {
        return this.set({
            token,
        });
    },
};
```

```ts
// app/controller/extend.ts
import { Controller } from 'egg';

export default class ExtendController extends Controller {
    public async response() {
        const { ctx } = this;
        ctx.response.setToken('XDS 7n9jxxxxx');
        ctx.body = 'success';
    }
}

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/extend/response', controller.extend.response);
};

// 访问 /extend/response，在谷歌开发者工具 Network 查看这次请求，可以看到 Response Headers 里带有了 token
```

### helper

自定义扩展工具函数，如扩展一个 base64 编码 `base64Encode`

```ts
// app/extend/helper.ts
export default {
    base64Encode(str = '') {
        return new Buffer(str).toString('base64');
    },
};
```

```ts
// app/controller/extend.ts
import { Controller } from 'egg';

export default class ExtendController extends Controller {
    public async helper() {
        const { ctx } = this;
        ctx.body = { name: ctx.helper.base64Encode('karmiy') };
    }
}

// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/extend/helper', controller.extend.helper);
};

// 访问 /extend/helper 即可
```

## 定时任务

虽然我们通过框架开发的 HTTP Server 是请求响应模型的，但是仍然还会有许多场景需要执行一些定时任务，例如：

- 定时上报应用状态
- 定时从远程接口更新本地缓存
- 定时进行文件切割、临时文件删除

> Egg.js 约定定时任务在 app/schedule 文件夹

如下，简单实现一个定时打印当前时间的任务：

```ts
// 新建 app/schedule/get-time.ts
import { Subscription } from 'egg';

export default class GetTime extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            //   interval: '2s', // 2s 间隔
            //   interval: 3000, // 3s 间隔

            // cron 有 6 个星号，需要更灵活的配置，cron 更合适
            // second (0 - 59, optional)
            // minute (0 - 59)
            // hour (0 - 23)
            // day of month (1 - 31)
            // month (1 - 12)
            // day of week (0 - 7) (0 or 7 is Sun)
            // cron: '0 0 */3 * * *', // 每三小时准点执行一次
            cron: '*/3 * * * * *', // 每 3 秒执行一次

            // type: 'all', // 指定所有的 worker 都需要执行（因为 Egg.js 是多进程，会有需要 worker 进行都在跑这个源码，具体见官网 “多进程模型和进程间通讯” 小节）
            type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        console.log(Date.now());
    }
}
```

> 注：需重启项目

## 连接 MySQL 数据库

[官方文档](https://eggjs.org/zh-cn/tutorials/mysql.html)

### 安装 MySQL

- 官方下载
- 解压
- 配置环境变量
- 安装服务、初始化、启动
- 安装 Navicat 连接 MySQL
- 新建数据库 'test-egg'（下面都以这个数据库和表为例）
- 新建表 'user'，包含 'id'（键，自递增）、'name' 字段

[MySQL 安装教程](https://www.cnblogs.com/rysinal/p/7565259.html)

[Navicat for MySQL](https://www.navicat.com.cn/download/navicat-for-mysql)

### NodeJs 连接 MySQL

MySQL 8.0 引入了一个新的加密方式 `caching_sha2_password`，而 NodeJs 模板并未完全支持

这也会导致 Egg.js 连接时可能会失败，进而导致 `npm run dev` 启动错误

```sh
# 管理员身份运行 cmd

# 登录 mysql，这时会让你输入密码，而后命令前缀为 mysql>
mysql -u root -p
> Enter password: **********

mysql> alter user 'root'@'localhost' identified with mysql_native_password by '密码';
Query OK, 0 rows affected (0.01 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.01 sec)

mysql> quit
Bye
```

### Egg.js 配置

```sh
npm i --save egg-mysql
```

```ts
// 配置 config/plugin.ts
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // 新增配置
    mysql: {
        enable: true,
        package: 'egg-mysql',
    },
};

export default plugin;
```

```ts
// 配置 config/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    
    // ...

    config.mysql = {
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
        // 单数据库信息配置
        client: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: 'xxxx',
            // 数据库名
            database: 'test-egg',
        },
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
```

```ts
// 由于 Egg.js 并没有编译时为 app 加上 mysql 类型，所以我们需要自己扩展一下 typescript 类型
// 在项目根目录新建一个 global.d.ts

import 'egg';
import { Application } from 'egg';

interface Result {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}

type Row = Record<string, any>;
type Options = Record<string, any>;

// tableName 表名
// row 参数
// options 其他查询条件（如 where、orders）
declare module 'egg' {
    interface Application {
        mysql: {
            // 查整个表、条件查询和结果定制
            select: <T>(tableName: string, options?: Options) => Promise<T>;
            // 查一条记录
            get: <T>(tableName: string, row: Row) => Promise<T>;
            // 增
            insert: (tableName: string, row: Row) => Promise<Result>;
            // 改
            update: (tableName: string, row: Row, options?: Options) => Promise<Result>;
            // 删
            delete: (tableName: string, row: Row) => Promise<Result>;
        };
    }
}
```

### Read

```ts
// app/service/User.ts
import { Service } from 'egg';

const asyncWrapper = <T>(promise: Promise<T>) => {
    return promise
        .then(data => [ data, null ] as [T, null])
        .catch(err => [ null, { res: err }] as [null, { res: any }]);
};

/**
 * User Service
 */
export default class User extends Service {
    public async mysqlGet(id: number) {
        const { app } = this;

        // const querySQL = app.mysql.select<Array<{ id: number; name: string }>>('user'); // 查整个表
        const querySQL = app.mysql.get<{ id: number; name: string }>('user', { id }); // 查指定 id 的记录
        const [ res, error ] = await asyncWrapper(querySQL);

        if (error) {
            console.log(error);
            return;
        }

        return res;
    }
}
```

```ts
// app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    public async getMysqlUser() {
        const { ctx } = this;

        const user = await ctx.service.user.mysqlGet(Number(ctx.params.id ?? 1));
        ctx.body = user ?? {};
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/mysql/getUser/:id', controller.user.getMysqlUser);
};

// 访问 /mysql/getUser/=1 即可
```

### Create

```ts
// app/service/User.ts
import { Service } from 'egg';

const asyncWrapper = <T>(promise: Promise<T>) => {
    return promise
        .then(data => [ data, null ] as [T, null])
        .catch(err => [ null, { res: err }] as [null, { res: any }]);
};

/**
 * User Service
 */
export default class User extends Service {
    public async mysqlAdd(name: string) {
        const { app } = this;
        const querySQL = app.mysql.insert('user', { name });
        const [ res, error ] = await asyncWrapper(querySQL);

        if (error) {
            console.log(error);
            return;
        }

        return res;
    }
}
```

```ts
// app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    public async addMysqlUser() {
        const { ctx } = this;

        const res = await ctx.service.user.mysqlAdd(ctx.query.name ?? `user-${Date.now().toString().slice(0, 6)}`);
        // res?.affectedRows === 1 && console.log('成功');
        ctx.body = res ?? {};
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/mysql/addUser', controller.user.addMysqlUser);
};

// 访问 /mysql/addUser?name=kealm 即可
```

### Update

```ts
// app/service/User.ts
import { Service } from 'egg';

const asyncWrapper = <T>(promise: Promise<T>) => {
    return promise
        .then(data => [ data, null ] as [T, null])
        .catch(err => [ null, { res: err }] as [null, { res: any }]);
};

/**
 * User Service
 */
export default class User extends Service {
    public async mysqlUpdate(id: number, name: string) {
        const { app } = this;
        const querySQL = app.mysql.update('user', { id, name });
        const [ res, error ] = await asyncWrapper(querySQL);

        if (error) {
            console.log(error);
            return;
        }

        return res;
    }
}
```

```ts
// app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    public async updateMysqlUser() {
        const { ctx } = this;

        const { id, name } = ctx.params;
        const res = await ctx.service.user.mysqlUpdate(Number(id), name);
        // res?.affectedRows === 1 && console.log('成功');
        ctx.body = res ?? {};
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/mysql/updateUser/:id/:name', controller.user.updateMysqlUser);
};

// 访问 /mysql/updateUser/1/kate 即可
```

### Delete

```ts
// app/service/User.ts
import { Service } from 'egg';

const asyncWrapper = <T>(promise: Promise<T>) => {
    return promise
        .then(data => [ data, null ] as [T, null])
        .catch(err => [ null, { res: err }] as [null, { res: any }]);
};

/**
 * User Service
 */
export default class User extends Service {
    public async mysqlDelete(id: number) {
        const { app } = this;
        const querySQL = app.mysql.delete('user', { id });
        const [ res, error ] = await asyncWrapper(querySQL);

        if (error) {
            console.log(error);
            return;
        }

        return res;
    }
}
```

```ts
// app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    public async deleteMysqlUser() {
        const { ctx } = this;

        const { id } = ctx.params;
        const res = await ctx.service.user.mysqlDelete(Number(id));
        // res?.affectedRows === 1 && console.log('成功');
        ctx.body = res ?? {};
    }
}
```

```ts
// app/router.ts
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/mysql/deleteUser/:id', controller.user.deleteMysqlUser);
};

// 访问 /mysql/deleteUser/4 即可
```