const { User, Role, CarDispatchForm, Summary } = require("../db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;



const axios = require('axios');
// async function test() {
//   var u = await User.findOne({
//     include: {
//       model: Role
//     },
//     account: "lining"
//   });

//   console.log("*****************************");
//   console.log(u);
//   console.log("*****************************");
// }

// test();

// async function test() {
//   // Summary.create({ id: 201801, data: '[{"type":"总计","data":[{}]}]'});
//   let s = await Summary.findOne({
//     where: {
//       createdAt: {
//         [Op.lt]:new Date()
//       }
//     }
//   });
//   if(s){
//      console.log(JSON.parse(s.get({ plain: true }).data).length);
//   }else{
//     console.log('-----------nonono--------------');
//   }


// }

// test();


// let str = JSON.stringify([{type:"总计",data:[{}]}] );
// console.log(str)

// let obj = JSON.parse('[{"type":"总计","data":[{}]}]');
// console.log(obj);


// console.log(new Date(new Date("2019-3-01").getTime() - 1000 * 60 * 60 * 24).toLocaleDateString())

// axios.get('http://api.map.baidu.com/routematrix/v2/driving?output=json&origins=40.45,116.34|40.54,116.35&destinations=40.34,116.45|40.35,116.46&ak=fcoj4cVVaE4zaCQ1yjD9neuZlZd9IwPL')
//     .then(function (response) {
//         console.log(response.data.result);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


// axios.get('	http://api.map.baidu.com/location/ip?ip=10.4.148.155&ak=fcoj4cVVaE4zaCQ1yjD9neuZlZd9IwPL&coor=bd09ll')
//     .then(function (response) {
//         console.log(response.data);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// function showLocation() { }
// axios.get(escape('http://api.map.baidu.com/geocoder/v2/?address=北京市海淀区上地十街10号&output=json&ak=fcoj4cVVaE4zaCQ1yjD9neuZlZd9IwPL&callback=showLocation'))
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });