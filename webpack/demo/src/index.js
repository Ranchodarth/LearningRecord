/* 
    index.js: webpack入口起点文件

    开发环境打包指令：webpack ./src/index.js -o ./build/built.js --mode=development
    生产环境打包指令：
*/

function add (x, y) {
    return x+y;
}

console.log(add(1,2));