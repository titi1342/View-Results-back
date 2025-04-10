// hash.js
const bcrypt = require('bcrypt');

const password = "Tape The Password Here";

bcrypt.hash(password, 10)
  .then((hash) => {
    console.log("Hash généré :", hash);
  })
  .catch((err) => {
    console.error("Erreur :", err);
  });
