// var cron = require("node-cron");

// cron.schedule("*/2 * * * * *", () => {
//   console.log("running a task every minute");
// });

// let now = new Date('2018-12-12');


//     console.log(now.getDate());
//     console.log(now.getMonth());
//     console.log(now.getFullYear());

// class Test {
//     constructor(opt = {}) {
//         this.key = opt.key ? opt.key : "";
//         this.distance = opt.distance ? opt.distance : 0.0;
//         this.times = opt.times ? opt.times : 0;
//         this.places = opt.places ? opt.places : "";
//     }
// }

// let t = new Test({ key: "总计" });



// console.log(JSON.stringify(t));

let obj = {}
obj['a'] = 1
for(let value of Object.keys(obj)){
    console.log(value)
}
console.log(Object.keys(obj))