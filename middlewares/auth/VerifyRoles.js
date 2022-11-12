const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    // spread roles 
    const givenAllowRoles = [...allowedRoles];
    
    const results = req.roles.map((role) => givenAllowRoles.includes(role)) // check if each authorized role is in req roles
      .find((value) => value === true); // if the array contains at least one true -> 

    if (!results) return res.status(401).json({ results: "results" });
    next();
  };
};

module.exports = verifyRoles;
