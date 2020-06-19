import tenant from "./tenant";

export default class tenantBuilder {
  setName(name) {
    this.name = name;
    this.createdAt = new Date();
    return this;
  }
  setEmail(email) {
    this.email = email;
    return this;
  }
  setFrom(from) {
    this.from = from;
    return this;
  }
  setIdUsers(idUsers) {
    this.idUsers = idUsers;
    return this;
  }
  build() {
    return new tenant(this);
  }
}
