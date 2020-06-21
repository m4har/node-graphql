require("dotenv").config;
import bcrypt, { hash } from "bcrypt";
import { AuthenticationError } from "apollo-server-express";
import { sign } from "jsonwebtoken";
import { users, roles, tenants } from "../mongo/models";
import userBuilder from "../builder/user/userBuilder";
import tenantBuilder from "../builder/tenant/tenantBuilder";

const SECRET_KEY = process.env.SECRET_KEY || "m*GGn!z3m*";

export const resolver = {
  Query: {
    foo: () => "bar",
    // get my profile user
    profile: async (_, data, context) => {
      if (!context.valid) {
        throw new AuthenticationError("need login");
      }
      const [myProfile, usersLength, tenantsLength] = await Promise.all([
        users.findOne({
          _id: context.id,
        }),
        users.find().then((data) => data.length),
        tenants.find({ idUsers: context.id }).then((data) => data.length),
      ]);
      return {
        allUsers: usersLength,
        myTenant: tenantsLength,
        name: myProfile.name,
        photo: myProfile.photo,
        email: myProfile.email,
        role: myProfile.role,
      };
    },
    // get all users profile
    allUser: async (_, data, context) => {
      if (!context.valid) {
        throw new AuthenticationError("need login");
      }
      const all = await users.find();
      return all;
    },
    // find user
    user: async (_, data, context) => {
      if (!context.valid) throw new AuthenticationError("need login");
      const findUser = await users.findById(data.id).catch(() => ({}));
      return findUser;
    },
    role: async (_, data, context) => {
      if (!context.valid) throw new AuthenticationError("need login");
      const allRrole = await roles.find();
      return allRrole;
    },
  },
  Mutation: {
    // login and get jwt
    loginUser: async (_, data) => {
      const findUser = await users.findOne({ email: data.email });
      if (!findUser) throw new AuthenticationError("Not Registered");
      const compare = await bcrypt.compare(data.password, findUser.password);
      if (!compare) throw new AuthenticationError("Password not match");
      const token = sign({ id: findUser._id }, SECRET_KEY);
      return { token, msg: "success", status: true };
    },
    // create new users office
    createUser: async (_, data, context) => {
      if (!context.valid)
        throw new AuthenticationError("need login or need super admin");
      if (context.role !== "super admin")
        throw new AuthenticationError("only for super admin");
      const [checkEmail, checkRole] = await Promise.all([
        users.findOne({ email: data.email }),
        roles.findOne({ role: data.role.toLowerCase() }),
      ]);
      if (checkEmail) throw new AuthenticationError("Email allready");
      if (!checkRole) throw new AuthenticationError("Role not available");
      const password = await hash(data.password, 12);
      const build = new userBuilder()
        .setName(data.name)
        .setEmail(data.email)
        .setPassword(password)
        .setRole(data.role)
        .setPhoto(
          "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
        )
        .build();
      const newUser = new users(build);
      await newUser.save();
      return "add";
    },
    // edit user office
    editUser: async (_, data, context) => {
      if (!context.valid)
        throw new AuthenticationError("need login or need super admin");
      if (context.role !== "super admin")
        throw new AuthenticationError("only for super admin");
      const checkRole = await roles.findOne({ role: data.role.toLowerCase() });
      if (!checkRole || data.role === "super admin".toLocaleLowerCase())
        throw new AuthenticationError("Role not available");
      const { id, name, role } = data;
      await users.findByIdAndUpdate(id, {
        name,
        role: role.toLowerCase(),
      });
      return "Edited";
    },
    // add user tenant
    addTenant: async (_, data, context) => {
      if (!context.valid)
        throw new AuthenticationError("need login or need super admin");
      const checkTenant = await tenants.findOne({ email: data.email });
      if (checkTenant) throw new AuthenticationError("Email Tenant Allready");
      const build = new tenantBuilder()
        .setEmail(data.email)
        .setFrom(data.from)
        .setName(data.name)
        .setIdUsers(context.id)
        .build();
      const newTenant = new tenants(build);
      await newTenant.save();
      return "Tenant Added";
    },
    // delete users office
    deleteUser: async (_, data, context) => {
      if (!context.valid) throw new AuthenticationError("need login");
      if (context.role !== "super admin")
        throw new AuthenticationError("only for super admin");
      const deleteUsers = await users.findByIdAndDelete(data.id);
      if (!deleteUsers) return "Allready deleted";
      return "Users deleted";
    },
  },
};
