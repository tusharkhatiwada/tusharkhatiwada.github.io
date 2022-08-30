module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx"],
          root: ["src"],
          alias: {
            types: "./types",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  }
}
