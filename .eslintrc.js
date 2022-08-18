module.exports = {
    env: {
        node: true,
        es6: true,
    },
    parserOptions: {
        sourceType: "module",
        allowImportExportEverywhere: true,
        ecmaVersion: 8,
        //requireConfigFile: false,
    },
    "parser": "@babel/eslint-parser",
    root: true,
    //extends: ["eslint:recommended", "plugin:prettier/recommended"],
};