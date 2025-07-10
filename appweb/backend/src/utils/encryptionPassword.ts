const bcrypt = require("bcrypt");

export async function encryptionPassword(password: String) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function verifyPassword(
  enteredPassword: string,
  savedHash: string
) {
  const coincidence = await bcrypt.compare(enteredPassword, savedHash);
  return coincidence;
}
