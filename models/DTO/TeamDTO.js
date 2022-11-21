const {UserDTO}  = require('./UserDTO');
class TeamDTO 
{
    teamName;
    teamLeader;
    members;

    constructor(teamLeader, members, teamName) {
        this.teamName = teamName;
        this.teamLeader = new UserDTO(teamLeader);
        this.members = members.map((user)=> new UserDTO(user));
        
    }
}


module.exports = {TeamDTO};