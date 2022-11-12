const ActivateCodeModel = require("../models/ActivatationCode");
const randomString = require("randomstring");

function generateListForCode() {
  let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 26; i++) {
    list.push(String.fromCharCode(97 + i));
  }

  return list;
}

/* 
 create and save new activation code
 userId: id of the user associated with the activation code
 
 TODO:: encode the activation code -> security issues
 
 */
async function generateAndSaveCode(userId) {
  const listOfOptionsForCode = generateListForCode();

  let code = [];

  // activation code contains 4 characters
  for (let index = 0; index < 4; index++) {
    const randomNum =
      Math.floor(Math.random() * listOfOptionsForCode.length) + 1;
    code.push(listOfOptionsForCode[randomNum]);
  }
  console.log(code);
  // join code list to code as string
  const activationCodeAsString = randomString.generate().substring(0, 4);
  // const activationCodeAsString = code.join("");

  const activationCode = new ActivateCodeModel({
    user_id: userId,
    code: activationCodeAsString,
  });

  // saves and return code;
  try {
    const savedCode = await activationCode.save();
    console.log(savedCode.user_id);
    return savedCode;
  } catch (err) {
    throw err;
  }
}

module.exports = { generateAndSaveCode, generateListForCode };
