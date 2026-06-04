const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * Config Plugin: Force androidx.activity to version 1.9.3
 *
 * Reason: androidx.activity:1.11.0 requires AGP 8.9.1+ and compileSdk 36+,
 * but react-native 0.79.x uses AGP 8.8.2 and compileSdk 35.
 * Some transitive dependencies pull in activity 1.11.0 and cause build failure.
 */
const withForceActivityVersion = (config) => {
  return withAppBuildGradle(config, (mod) => {
    const contents = mod.modResults.contents;

    const snippet = `
// Force androidx.activity to a version compatible with AGP 8.8.2 + compileSdk 35
// androidx.activity:1.11.0 requires AGP 8.9.1+ and compileSdk 36+
configurations.all {
    resolutionStrategy {
        force "androidx.activity:activity:1.9.3"
        force "androidx.activity:activity-ktx:1.9.3"
    }
}
`;

    // Avoid adding the block twice
    if (contents.includes("androidx.activity:activity:1.9.3")) {
      return mod;
    }

    // Insert before the `dependencies {` block
    mod.modResults.contents = contents.replace(
      /^dependencies \{/m,
      `${snippet}\ndependencies {`
    );

    return mod;
  });
};

module.exports = withForceActivityVersion;
