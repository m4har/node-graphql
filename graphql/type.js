export const type = `
type AuthPayload {
  token: String
  msg: String
  status: Boolean
}
type Tenant {
  name: String
  from: String
}
type Profile {
  name: String
  photo: String
  email: String
  role: String
  tenant: [Tenant]
  myTenant: Int
  allUsers: Int
}
type Role {
  role: String
  id: String
}
type User {
  id: String
  name: String
  photo: String
  email: String
  role: String
  tenant: [Tenant]
}
type Query {
  foo: String
  profile: Profile
  allUser: [User]
  user(id: String): User
  role:[Role]
}
type Mutation {
  loginUser(email: String!, password: String!): AuthPayload
  createUser(
    name: String
    email: String
    password: String
    role: String
  ): String
  editUser(id: String!, name: String!, role: String!): String
  addTenant(name: String!, from: String!, email: String!): String
  deleteUser(id:String!):String
}
`;
