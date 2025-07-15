如果你不是程序员, 从零开发并部署一个 Web 应用需要多长时间?

在 AI 的帮助下, 可能只需要半小时.

今天, 我将用 5 分钟时间, 手把手带你从零开始, 打造一个简单的在线记账应用

首先我们需要创建一个 postgres 数据库, 我们这次演示使用的是 Neon, 当然你也可以使用任意数据库云服务商. 点击登录按钮, 选择 Google 登录. 登录完成之后我们需要创建一个新的项目, 输入项目名称 Spend tracker, 选择一个数据库所在的区域, 然后点击创建按钮. 创建成功后, 我们可以得到数据库的连接信息, 复制连接信息, 稍后我们用这个数据库来存储用户数据.

接下来我们打开终端, 进入到我们日常工作的文件夹.

输入下面的命令, 使用我的 nextjs 模板新建一个 nextjs 项目

```shell
npx create-next-app@latest --example "https://github.com/bigmasonwang/nextjs-simple-starter" spend-tracker
```

等待项目创建完成, 用 VS Code 打开项目文件夹

打开 README.md 文件, 查看项目说明

接下来使用这一行命令创建.env 文件, 在这个文件中添加刚才的数据库连接信息

```shell
cp .env.example .env
```

另外, 我们回到 README.md 文件, 复制下面的命令生成一个随机的密钥, 将生成的密钥粘贴到.env 文件中, 之后要用这个密钥来加密用户密码.

```bash
openssl rand -base64 32
```

然后输入下面的命令, 初始化数据库

```bash
npx prisma migrate deploy
```

等待数据库 migration 完成, 我们可以启动这个 nextjs 项目

浏览器打开 http://localhost:3000, 可以看到项目的首页

点击开始按钮, 就可以跳转到用户注册页面, 输入用户名, 邮箱, 和密码, 点击注册按钮, 就可以跳转到 dashboard 页面, 我们之后在这个页面添加账单功能

回到数据库页面, 点击刷新, 可以看见数据库中多了一条数据, 这就是我们刚才注册的用户

再回到 VS Code, 创建一个新的终端窗口, 命令行输入 claude 启动 Claude code

然后我们要告诉 AI 我们的产品需要有怎样的功能, 一开始可以简单点, 只需要设计一个极简的记账应用, 在 dashboard 页面显示所有开销, 再创建一个对话框, 用于添加新的开销, 表单包含了日期, 金额, 分类, 和提交按钮.

```
Design and create a minimal expense tracker app,  displays all expenses on dashboard page, add a dialog with form to add new expenses with a date picker (defaulting to today), amount input, category dropdown (hard code), and submit button.
```

接下来就是等待 claude code 帮我们实现功能, 这个过程可能需要几分钟时间, 期间 claude 会问我们要不要运行一些命令, 就让它运行即可.

之后 claude 会停下来说代码实现完成了, 我们需要手动看一看关键的页面有没有明显的错误, 如果有错误就复制给 claude 让它来修.

记账这种简单的功能一般也不会出现什么疑难杂症, 有问题让 AI 自己改就行了.

回到浏览器, 测试一下 AI 写的代码, 点击添加开销, 输入金额, 选择分类和日期, 点击提交按钮, 我们发现这一条记录添加成功

很好,我们这个记账应用 MVP 的代码部分就完成了.

接下来我们需要把代码部署到服务器上,这样别人就可以访问到我们的应用了.

首先登录或创建你的 github 账户, 然后创建一个新的仓库, 仓库名称为 spend tracker, 然后复制仓库的地址, 稍后我们让 claude code 来帮我们把代码推送到 github 上.

回到 VS Code, 继续和 Claude 的对话, 告诉它把现在的代码 commit 一下, 然后 push 到刚才创建的仓库上.

回到浏览器, 点击刷新, 可以看见我们的代码已经成功推送到 github 上了.

然后我们选择用 Vercel 来部署我们的应用.

登录或创建你的 Vercel 账户, 添加一个新项目, 导入刚 push 到 github 的仓库.

我们需要配置下数据库 URL 和登录密钥, 你可以直接粘贴本地的 env 文件中的内容到 Vercel 的环境变量中, 配置完成之后点击 Deploy 按钮.

等待部署完成, 我们就可以在线访问我们的应用了.

打开我们的应用, 你可以使用刚才创建的用户登录, 因为我们本地程序和在线程序使用的是同一个数据库, 登录成功后你也会看见之前你在本地添加的开销.

你可以做一些简单的测试, 没问题的话就可以分享这个产品链接给你的朋友体验了.

要注意下, vercel.app 域名在国内访问速度比较慢, 不过你可以配置你的域名指向这个项目, 之后就可以正常打开了.

---

所以, 回到最初的问题. 如果你不是程序员, 从零开发并部署一个 Web 应用到底需要多久？

半小时? 确实有可能, 不过你并不知道你用 AI 写了什么东西, 用了什么技术, 你不知道什么是 nextjs, 也不知道什么是 github.

一旦遇到 AI 无法解决的 bug, 你可能会束手无策.

不过, 这并不意味着你应该放弃. 在 AI 的帮助下, 原本需要一两年才能掌握的技能, 现在几周就能学会.

下面列出了成为独立 Web 开发者需要掌握的核心技能:

- HTML
- CSS & Tailwind CSS
- TypeScript
- React
- Next.js
- Git & GitHub
- Postgres
- Prisma / Drizzle
- Vercel / Cloudflare Worker
- SEO

HTML 是网页的内容和结构
CSS 让网页变得好看
TypeScript 编写所有业务逻辑
React 和 Next.js 让我们更容易编写和维护全栈项目
Git & GitHub 帮我们管理代码版本以及和别人协作开发
Postgres 是储存各种信息的数据库
Prisma / Drizzle 使得操作数据库变得简单
Vercel / Cloudflare Worker 让我们轻松部署项目
SEO 让你的产品能够被更多人发现并带来收益

掌握这些知识, 你就到达了初级到中级程序员的门槛, 可以独立开发一个 Web 应用了.

更重要的是, 你将理解自己在做什么, 而不只是复制粘贴 AI 写的代码.

我在评论区置顶了这个视频所有的链接，包括今天演示的代码.

之后我会录制一系列更加深入的视频, 讲解各种技术的重点, 再带大家做一些练习的项目.

如果你觉得这个视频对你有帮助, 请帮我一键三连, 谢谢大家.
