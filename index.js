require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { gql, ApolloServer } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { users } from "./mongo/models";
import { resolver, type } from "./graphql";

mongoose.connect(
  `mongodb+srv://mahardicka:${process.env.PASSWORD_MONGO}@cluster0-hcoxl.gcp.mongodb.net/office?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const typeDefs = gql`
  ${type}
`;
const resolvers = {
  ...resolver,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  engine: {
    reportSchema: true,
  },
  introspection: true,
  context: async ({ req }) => {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decode = verify(token, SECRET_KEY);
      const { role, _id } = await users.findOne({ _id: decode.id });
      return { role, id: _id, valid: true };
    } catch (error) {
      return { role: "", id: "", valid: false };
    }
  },
});
app.use(cors());
app.use(helmet());
app.use(express.json());
server.applyMiddleware({ app });
app.listen(PORT, () => console.log("listen"));
