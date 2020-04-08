const arr = new Array(10000).fill(1);

function Foo() {
  var t = 'name';
}
console.time('==== for loop ====');
const len = arr.length;
for (let i = 0; i < len; i++) {
  Foo();
}
console.timeEnd('==== for loop ====');

console.time('==== forEach ====');
arr.forEach(() => { Foo() });
console.timeEnd('==== forEach ====');