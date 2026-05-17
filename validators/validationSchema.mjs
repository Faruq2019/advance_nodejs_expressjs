export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 5, max: 32 },
      errorMessage: "Username must be between 5 and 32 characters long",
    },
    notEmpty: {
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username is required and must be a string",
    },
  },
  displayName: {
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "DisplayName must be between 3 and 100 characters long",
    },
    notEmpty: {
      errorMessage: "DisplayName is required",
    },
    isString: {
      errorMessage: "DisplayName is required and must be a string",
    },
  },
};
