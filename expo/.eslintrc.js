module.exports = {
  extends: "expo",
  plugins: ["simple-import-sort", "prettier"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "prettier/prettier": "error",
  },
};
