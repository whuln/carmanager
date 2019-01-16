const { User, Role } = require("../db");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = class UserController {
  static async exist(ctx) {
    let data = ctx.request.body,
      // let data = ctx.request.query,
      token;

    if (data.token) {
      token = data.token;
    } else if (data.account && data.password) {
      let hash = crypto.createHash("md5");
      token = hash.update(data.account + data.password).digest("hex");
    } else {
      ctx.body = { code: 2, msg: "请输入用户名和密码！" };
    }

    //根据用户名密码，获取用户所有信息，用户的access信息。
    // let req = JSON.parse(ctx.req.body)
    let user = await User.findOne({
      include: [
        {
          model: Role
        }
      ],
      where: {
        token: token
      }
    });

    // console.log(user);

    if (!user) {
      ctx.body = { code: 1, msg: "用户名或密码不正确！" };
    } else {
      ctx.body = { code: 0, msg: user.get({ plain: true }) };
    }
  }

  static async addUser(ctx) {
    let data = ctx.request.body,
      token;

    //console.log(data);
    let hash = crypto.createHash("md5");
    token = hash.update(data.account + data.password).digest("hex");
    data.token = token;

    let r = await User.create(data);
    if (r) {
      ctx.body = { code: 0, msg: "用户添加成功！" };
    } else {
      ctx.body = { code: 1, msg: "用户添加失败！" };
    }
  }

  static async updateUser(ctx) {
    let data = ctx.request.body;
    if (data.password) {
      let hash = crypto.createHash("md5");
      data.token = hash.update(data.account + data.password).digest("hex");
      delete data.password;
    }
    let r;
    try {
      await User.upsert(data);
      r = { code: 0, msg: "修改成功！" };
    } catch (err) {
      r = { code: 1, msg: "修改失败！" };
    }

    ctx.body = r;
  }

  static async deleteUser(ctx) {
    let data = ctx.request.body;
    // console.log(data);
    let r;
    try {
      await User.destroy({ where: { account: { [Op.eq]: data.account } } });
      r = { code: 0, msg: "删除成功！" };
    } catch (err) {
      r = { code: 1, msg: "删除失败！" };
    }
    ctx.body = r;
  }

  static async findOne(ctx) {
    let data = ctx.request.body,
      where = {};
    if (data.account) {
      where.account = {
        [Op.eq]: data.account
      };
    }

    if (data.rolename) {
      where.rolename = {
        [Op.eq]: data.rolename
      };
    }

    if (data.department) {
      where.department = {
        [Op.eq]: data.department
      };
    }
    if (data.state) {
      where.state = {
        [Op.eq]: data.state
      };
    }
    let u = await User.findOne({
      where: where
    });

    if (u) {
      ctx.body = { code: 0, msg: u.get({ plain: true }) };
    } else {
      ctx.body = { code: 1, msg: "没有此用户！" };
    }
  }

  static async findUsers(ctx) {
    let data = ctx.request.body,
      users;
    if (data) {
      let where = {};
      if (data.account) {
        where.account = {
          [Op.like]: "%" + data.account + "%"
        };
      }

      if (data.rolename) {
        where.rolename = {
          [Op.eq]: data.rolename
        };
      }

      if (data.department) {
        where.department = {
          [Op.eq]: data.department
        };
      }
      if (data.state) {
        where.state = {
          [Op.eq]: data.state
        };
      }
      users = await User.findAll({
        where: where
      });
    } else {
      users = await User.findAll();
    }

    if (users) {
      ctx.body = { code: 0, msg: JSON.stringify(users) };
    } else {
      ctx.body = { code: 1, msg: "没有用户！" };
    }
  }
};
