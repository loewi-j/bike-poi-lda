
// 将Object的属性值输出成Array
export const objOfValueToArr = (object) => {
  let arr = [];
  let i = 0;
  for (let item in object) {
    arr[i] = object[item]
    i++;
  }
  return arr;
};