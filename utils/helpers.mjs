import * as bcrypt from "bcrypt";

const saltRound = 10;
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRound);
  const hash = await bcrypt.hash("s0/\/\p4$$w0rD", salt);
  return hash;
};

export const comparePassword = async (password, hashedPassword) => {
  const isTrue = await bcrypt.compare(password, hashedPassword);
};
