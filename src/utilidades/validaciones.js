export const emailValido = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const passwordValido = (pass) => {
  return pass.length >= 6;
};
