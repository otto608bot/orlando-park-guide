module.exports = function(eleventyConfig) {
  // Set input and output directories
  eleventyConfig.setInputDirectory('src');
  eleventyConfig.setOutputDirectory('_site');

  // Passthrough copy for CSS, Javascript, and all image assets
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.addPassthroughCopy('src/app.js');
  eleventyConfig.addPassthroughCopy('src/**/*.png');
  eleventyConfig.addPassthroughCopy('src/**/*.jpg');
  eleventyConfig.addPassthroughCopy('src/**/*.jpeg');
  eleventyConfig.addPassthroughCopy('src/**/*.gif');
  eleventyConfig.addPassthroughCopy('src/**/*.webp');
  eleventyConfig.addPassthroughCopy('src/**/*.svg');

  // Copy root directories that are outside src/
  eleventyConfig.addPassthroughCopy({ 'images': 'images' });
  eleventyConfig.addPassthroughCopy({ 'scripts': 'scripts' });
  eleventyConfig.addPassthroughCopy({ 'data': 'data' });

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