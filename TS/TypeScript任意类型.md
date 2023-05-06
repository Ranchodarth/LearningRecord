### 任意类型

``` 
let anything: any = "任意类型"
```

> 声明变量时，如没有指定类型，则默认为any
>
> any可以任意切换，任何类型的值都可赋值给any类型的值
>
> 使用any会失去类型检测

``` 
let unKnow: unknow = "任意类型"
```

>unknow可以任意切换，任何类型的值都可赋值给unknow类型的值



###### 区别

> any 类型可以赋值给其他类型，但unknow只能赋值给unknow和any类型
>
> unknow类型的复杂类型无法调用子属性和方法
>
> any类型的复杂类型调用不存在的子属性时，不会报错



