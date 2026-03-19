module.exports = function(eleventyConfig) {
  // Directories to pass through unchanged
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("blog");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("favicon-64x64.png");
  eleventyConfig.addPassthroughCopy("favicon-180x180.png");
  eleventyConfig.addPassthroughCopy("logo-full.png");
  eleventyConfig.addPassthroughCopy("logo-icon.png");
  eleventyConfig.addPassthroughCopy("logo-icon-square.png");
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("logo-text.png");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("_redirects");

  // Return configuration
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
