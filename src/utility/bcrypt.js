import bcrypt from "bcrypt";

export const generateSalt = () => {
  try {
    return bcrypt.genSalt(10);
  } catch (error) {
    throw error;
  }
};

export const generateHashPassword = (plainPassword, salt) => {
  try {
    return bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw error;
  }
};

export const verifyPassword = (plainPassword, hashPassword) => {
  try {
    return bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    throw error;
  }
};
