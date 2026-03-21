module.exports = function(eleventyConfig) {
  // Passthrough static files
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/data");
  eleventyConfig.addPassthroughCopy("logo*.png");
  eleventyConfig.addPassthroughCopy("favicon*.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  
  return { 
    dir: { input: "src", output: "_site" }, 
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
