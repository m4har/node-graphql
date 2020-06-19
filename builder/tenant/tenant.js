export default class tenant {
  constructor(builder) {
    this.name = builder.name;
    this.email = builder.email;
    this.from = builder.from;
    this.idUsers = builder.idUsers;
    this.createdAt = builder.createdAt;
    this.updatedAt = builder.createdAt;
  }
}
