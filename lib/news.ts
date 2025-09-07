export type Article = {
  title: string;
  url: string;
  description: string;
};

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

export async function fetchArticles(categories: string[]): Promise<Article[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();; // last 7 days

  const promises = categories.map(async (category) => {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          category
        )}&from=${since}&sortBy=publishedAt&apiKey=${
          process.env.NEWS_API_KEY
        }`    ,  { signal: controller.signal }
      );

      if (!res.ok) {
        console.error("Error while fetching category:", category);
        return [];
      }

      const data = await res.json();

      if (!data.articles) {
        console.error("Invalid response shape for category:", category);
        return [];
      }

       return data.articles.slice(0, 5).map((article: any) => ({
         title: article.title || "No title",
         url: article.url || "#",
         description: article.description || "No description available",
       }));
    } catch (error) {
      console.error("Exception while fetching category:", category, error);
      return [];
    }
  });

   const results = await Promise.all(promises);
   return results.flat();
}
