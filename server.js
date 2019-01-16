const Koa = require("koa");
const serve = require("koa-static");
const path = require("path");
const router = require("./server/koa-router");
const fs = require("fs");

const app = new Koa();

// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get("X-Response-Time");
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });
// // x-response-time

// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.set("X-Response-Time", `${ms}ms`);
// });

app.use(serve(path.join(__dirname, "dist")));
app.use(router.routes()).use(router.allowedMethods());

//匹配vue-router路径，必须放在所有路径之后。
app.use(async ctx => {
  ctx.response.type = "html";
  ctx.response.body = fs.readFileSync("./dist/index.html", "utf8");
});

app.listen(5555);
console.log("open http://localhost:5555");
