module.exports = function(eleventyConfig) {
  // Passthrough static files
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/data");
  eleventyConfig.addPassthroughCopy("logo*.png");
  eleventyConfig.addPassthroughCopy("favicon*.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  
  // Copy park images (at project root)
  eleventyConfig.addPassthroughCopy("*.jpeg");
  eleventyConfig.addPassthroughCopy("*.webp");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.png");
  
  // Copy blog images
  eleventyConfig.addPassthroughCopy("blog/");
  
  return { 
    dir: { input: "src", output: "_site" }, 
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
