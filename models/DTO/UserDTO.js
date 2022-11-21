class UserDTO {
  id;
  name;
  email;
  roles;
  team;

  constructor(user)
  {
    this.email = user.email;
    this.id = user._id;
    // this.roles = user.roles;
    this.name = user.name;
    this.team = user.team;
  }
}

module.exports = {UserDTO}
