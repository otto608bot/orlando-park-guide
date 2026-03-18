module.exports = function(eleventyConfig) {
  // Set input and output directories
  eleventyConfig.setInputDirectory('src');
  eleventyConfig.setOutputDirectory('_site');

  // Passthrough copy for CSS and image assets
  eleventyConfig.addPassthroughCopy('src/**/*.css');
  eleventyConfig.addPassthroughCopy('src/**/*.{png,jpg,jpeg,gif,webp,svg}');

  // Return configuration options
  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_includes/layouts',
      data: '_data'
    },
    templateFormats: ['html', 'njk', 'md', 'liquid'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    pathPrefix: '/'
  };
};