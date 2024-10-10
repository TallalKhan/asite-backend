/* Middleware validator for JOI schema */

module.exports = {
  validate: async (schema, data) => {
    const { error } = schema.validate(data);

    if (error) {
      const message = error.details.map((i) => i.message).join(",");
      throw new Error(message);
    }

    return true;
  },
};
