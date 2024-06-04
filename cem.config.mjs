function hidePrivatesPlugin() {
  return {
    name: "hide-privates-plugin",
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest?.modules?.forEach((mod) => {
        mod?.declarations?.forEach((dec) => {
          if (dec.kind === "class" || dec.kind === "mixin") {
            // eslint-disable-next-line no-param-reassign
            dec.members = dec?.members
              ?.filter((i) => i?.privacy !== "protected")
              ?.filter((i) => i?.privacy !== "private");
          }
        });
      });
    },
  };
}

export default {
  globs: ["src/**/*.ts", "src/**/*.js"],
  exclude: ["src/**/*.stories.ts", "src/**/*.styles.ts", "src/**/*.stories.js", "src/**/*.styles.js"],
  outdir: "./",
  dev: false,
  litelement: true,
  dependendies: true,
  plugins: [hidePrivatesPlugin()],
};
