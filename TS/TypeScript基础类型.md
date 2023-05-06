### 基础类型

***

#### 字符串

```typescript
let a: string = "罗本"
let b: string = `${ a }内切`
```



#### 数字

```
let notANumber: number = NaN //Nan
let number: number = 1 //整数
let infinityNumber: number = Infinity; //无穷
let decimal: number = 10 //10进制
let binary: number = 0b1010 //2进制
let octal: number = 0o744 //8进制
let hex: number = 0xf00d //16进制
```



#### 布尔

``` 
let bol: boolean = true
```



#### Null

``` 
let n: null = null
```



#### undefined

``` 
let u: undefined = undefined
```



#### 空

``` 
let v: void = null //严格模式会报错
let v2: void = undefined
function f1 (): void {} //void 表示期望没有返回值
```



> void和null与undefined的区别：
>
> null与undefined是所有类型的子类型，可以赋值给任何值
>
> void不可赋值给其他类型

