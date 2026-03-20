module.exports = function(eleventyConfig) {
  // Copy all static files to output
  // Assets in src/ directory
  eleventyConfig.addPassthroughCopy("src/images/**/*");
  eleventyConfig.addPassthroughCopy("src/data/**/*");
  eleventyConfig.addPassthroughCopy("src/scripts/**/*");
  eleventyConfig.addPassthroughCopy("src/styles/**/*");
  eleventyConfig.addPassthroughCopy("src/blog/**/*");
  
  // Assets at repo root (not in src/)
  eleventyConfig.addPassthroughCopy({ "logo*.png": "/" });
  eleventyConfig.addPassthroughCopy({ "favicon*.png": "/favicon/" });
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Use absolute paths for assets
  eleventyConfig.addNunjucksFilter("url", function(value) {
    if (value.startsWith("/")) return value;
    if (value.startsWith("./")) value = value.slice(2);
    return `/${value}`;
  });

  // Configure input/output directories
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "liquid",
    pathPrefix: "/"
  };
};