export  async function fetchArticles  (catgories:string[]){
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const promises = catgories.map(async(category) => {
        
        try {
            const res = await fetch(
              `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                category
              )}&from=${since}&sortBy=publishedAt&apiKey=${
                process.env.NEWS_API_KEY
              }`
            );
            if (!res.ok) {
               console.log("error while fetching this category",category)
            }
            const data = await res.json()
            return data.slice(0, 5).map((article:any) => ({
                title:article.title,
                url:article.url,
                description:article.description
            }))
        } catch (error) {
            console.log(error)
        }
    })

    const results = await Promise.all(promises)
    return results.flat()
}