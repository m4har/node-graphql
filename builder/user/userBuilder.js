import user from "./user";

export default class userBuilder {
  setName(name) {
    this.name = name;
    this.tenant = [];
    this.createdAt = new Date();
    return this;
  }
  setEmail(email) {
    this.email = email;
    return this;
  }
  setPassword(pass) {
    this.password = pass;
    return this;
  }
  setPhoto(photo) {
    this.photo = photo;
    return this;
  }
  setTenant(tenant) {
    this.tenant = tenant;
    return this;
  }
  setRole(role) {
    this.role = role;
    return this;
  }
  build() {
    return new user(this);
  }
}
