export default {
  eleventyComputed: {
    permalink: (data) => {
      if (data.page.fileSlug === "blog") return "/blog/index.html";
      return `/blog/${data.page.fileSlug}.html`;
    }
  }
};
