export const samplePosts = {
  "free-things-disney-world": {
    title: "25 Free Things to Do at Disney World (That Are Actually Good)",
    excerpt: "Disney World is expensive—but the magic doesn't have to cost a fortune. Here's how we found free fun on our last family trip.",
    publishedAt: "2026-03-15T00:00:00Z",
    readTime: 12,
    categories: [{ title: "Disney World", slug: { current: "disney-world" } }],
    tags: ["free", "disney-world", "orlando", "budget"],
    heroImage: { asset: { url: "https://planyourpark.com/disney-world.webp" }, alt: "Disney World Castle" },
    author: { name: "Plan Your Park Team" },
    body: [
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Disney World is expensive—but the magic doesn't have to cost a fortune. Here's how we found free fun on our last family trip." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "🎭 Free Entertainment" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Disney's entertainment is world-class, and much of it is completely free with park admission." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "🏰 Free Photo Opportunities" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "From Character meets to castle views, there are countless spots for memorable photos without any extra cost." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "🌳 Free Outdoor Activities" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Explore nature trails, splash pads, and outdoor play areas scattered throughout all four parks." }] }
    ]
  },
  "disney-world-guide": {
    title: "Complete Disney World Planning Guide for Families",
    excerpt: "Everything you need to know to plan the perfect Disney World vacation with kids of all ages.",
    publishedAt: "2026-02-15T00:00:00Z",
    readTime: 18,
    categories: [{ title: "Guides", slug: { current: "guides" } }],
    tags: ["disney-world", "planning", "family", "kids"],
    heroImage: { asset: { url: "https://planyourpark.com/Magic-Kingdom.webp" }, alt: "Magic Kingdom" },
    author: { name: "Plan Your Park Team" },
    body: [
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Planning a Disney World vacation can feel overwhelming. After dozens of trips, here's what we've learned." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "📅 When to Go" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "The best time to visit Disney World is typically January through early March, or September through mid-November." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "🏨 Where to Stay" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "On-property hotels offer extra magic hours and free transportation, but nearby options can save significant money." }] },
      { _type: "block", style: "h2", children: [{ _type: "span", text: "🎫 Tickets & Reservations" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Book park reservations as early as possible, especially for Magic Kingdom on weekends." }] }
    ]
  }
};

export function getSamplePostSlugs() {
  return Object.keys(samplePosts);
}

export function getSamplePost(slug: string) {
  return samplePosts[slug as keyof typeof samplePosts] || null;
}