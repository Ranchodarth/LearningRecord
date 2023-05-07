### 初识
---

[toc]

---
>TypeScript 是JavaScript的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。
>>2012年10月，微软发布了TypeScript的第一个版本。


>TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

---

### 为什么

---
##### 为什么选择TS ？
    截止本文撰写日期，国内大约44%的JS开发者会经常用到TS。
    2019年使用TS的开发者为25%，较上一年17%提升了8%。
##### TS增加了代码的可读性和维护性

    TypeScript 是 JavaScript 的超集，.js 文件可以直接重命名为 .ts 即可
    即使不显式的定义类型，也能够自动做出类型推论
    可以定义从简单到复杂的几乎一切类型
    即使 TypeScript 编译报错，也可以生成 JavaScript 文件
    兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供     TypeScript 读取

##### TS更加包容
    
    大部分第三方库都有提供给 TypeScript 的类型定义文件
    Google 开发的 Angular2 就是使用 TypeScript 编写的
    TypeScript 拥抱了 ES6 规范，也支持部分 ESNext 草案的规范

##### TS的缺点
    
    任何事物都是有两面性的，我认为 TypeScript 的弊端在于：有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念
    短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本
    集成到构建流程需要一些工作量
    可能和一些库结合的不是很完美




------------------------------------------------------------
> 内容参考[TypeScript入门教程](https://ts.xcatliu.com/introduction/what-is-typescript)