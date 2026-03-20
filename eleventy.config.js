module.exports = function(eleventyConfig) {
  // Copy all static files to output
  eleventyConfig.addPassthroughCopy("src/images/**/*");
  eleventyConfig.addPassthroughCopy("src/data/**/*");
  eleventyConfig.addPassthroughCopy("src/scripts/**/*");
  eleventyConfig.addPassthroughCopy("src/styles/**/*");
  eleventyConfig.addPassthroughCopy("src/favicon*.png");
  eleventyConfig.addPassthroughCopy("src/logo*.png");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/CNAME");

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