const Router = require("koa-router");
const koaBody = require("koa-body");
const Cors = require("koa2-cors");

const UserController = require("./controller/user-ctrl");
const CarController = require("./controller/car-ctrl");
const CarUseFormController = require("./controller/caruseform-ctrl");
const SummaryController = require("./controller/summary-ctrl");

var router = new Router({
  prefix: "/rest"
});

router.use(koaBody());
router.use(
  Cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE"]
  })
);

// router.use((async (ctx,next)=>{
//   console.log("ip : " + ctx.request.ip);
//   await next();
// }));

router.post("/login", UserController.exist);

// //user actions
router.post("/getusers", UserController.findUsers);
router.post("/getoneuser", UserController.findOne);
router.post("/adduser", UserController.addUser);
router.post("/updateuser", UserController.updateUser);
router.post("/deleteuser", UserController.deleteUser);

// //car actions
router.post("/getcars", CarController.findcars);
router.post("/getonecar", CarController.findOne);
router.post("/addcar", CarController.addCar);
router.post("/updatecar", CarController.updateCar);
router.post("/deletecar", CarController.deleteCar);

//car use form actions
router.post("/getucfs_user", CarUseFormController.userGetCaruseform);
router.post("/adducfs_user", CarUseFormController.userAddCaruseform);
router.post("/getucfs_dm", CarUseFormController.dmGetCaruseform);
router.post("/upsert_ucf", CarUseFormController.upsertCaruseform);
router.post("/getucfs_admin", CarUseFormController.adminGetCaruseform);
router.post("/getucfs_driver", CarUseFormController.driverGetCaruseform);

//summary actions
router.post("/getsummary", SummaryController.getSummary);
module.exports = router;
