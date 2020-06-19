export default class user {
  constructor(builder) {
    this.name = builder.name;
    this.email = builder.email;
    this.password = builder.password;
    this.photo = builder.photo;
    this.tenant = builder.tenant;
    this.role = builder.role;
    this.createdAt = builder.createdAt;
    this.updatedAt = builder.createdAt;
  }
}
