#### 关于Object、object和{}

###### Object

> Object处于理论原型链顶端，所有Object类型就表示包含所有类型。
>
> 声明为Object类型的变量可以被赋值为任意类型

``` 
let name: Object = "罗本"
let age: Object = 39
let gender: Object = true
let isNull: Object = null
let isUndefined: Object = undefined
let skillBar: Object = ["内切"]
let characteristic: Object = {hair: "脱发"}
let match2013: Object = () => "三冠王"
//以上都没问题
```



###### object

>关于object类型，处于引用类型的顶端。一般用于泛型约束，使其所声明的变量无法被赋值为原始类型

``` 
let name: object = "罗本" //报错
let age: object = 39 //报错
let gender: object = true //报错
let isNull: object = null //报错
let isUndefined: object = undefined //报错
let skillBar: object = ["内切"] //正确
let characteristic: object = {hair: "脱发"} //正确
let match2013: object = () => "三冠王" //正确
```


###### {}

>字面量模式，可以理解为new Object

``` 
let name: {} = "罗本"
let age: {} = 39
let gender: {} = true
let isNull: {} = null
let isUndefined: {} = undefined
let skillBar: {} = ["内切"]
let characteristic: {} = {hair: "脱发"}
let match2013: {} = () => "三冠王"
```

>字面量类型虽然可以赋值任何类型的值，但是赋值后是无法再次进行修改的，相当于常量