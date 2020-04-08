export function genListener(name:string) {
  return function fn() {
    console.log(name);
  }
}