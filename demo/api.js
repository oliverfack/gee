// 模拟的请求返回
exports.getLuckDraw = ()=> {
  return new Promise((resolve, reject)=>{
   const arr = [121, 122, 123, 124, 121, 122, 123, 124, 121, 121]
   const data = {
       awardCode: arr[parseInt(Math.random(1) * 10)]
   }
   resolve(data)
 })
}
