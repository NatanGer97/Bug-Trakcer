class UserDTO {
  id;
  name;
  email;
  roles;

  constructor(user)
  {
    this.email = user.email;
    this.id = user._id;
    this.roles = user.roles;
  }
}

module.exports = {UserDTO}
