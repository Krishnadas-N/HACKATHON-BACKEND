const NewsAPI = require('newsapi');
require('dotenv').config();

const newsapi = new NewsAPI(process.env.NewsApi);

newsapi.v2.everything({
  q: '"domestic violence" AND women',
  language: 'en',
  sortBy: 'publishedAt'
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
