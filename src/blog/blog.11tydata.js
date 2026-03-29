export default {
  eleventyComputed: {
    permalink: (data) => {
      if (data.page.fileSlug === "index") return "/blog/index.html";
      return `/blog/${data.page.fileSlug}.html`;
    }
  }
};