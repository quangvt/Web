// console.log("HELLO WORLD");
console.log(process.argv.slice(2).reduce((acc, cur) => (+cur + acc), 0));
