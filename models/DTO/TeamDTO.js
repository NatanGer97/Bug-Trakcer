const {UserDTO}  = require('./UserDTO');
class TeamDTO 
{
    id;
    teamName;
    teamLeader;
    members;

    constructor(teamLeader, members, teamName, id) {
        this.teamName = teamName;
        this.teamLeader = new UserDTO(teamLeader);
        this.members = members.map((user)=> new UserDTO(user));
        this.id = id;
        
    }
}


module.exports = {TeamDTO};