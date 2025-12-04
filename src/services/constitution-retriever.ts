
import { indianConstitution, ConstitutionArticle } from '@/data/indian_constitution';

/**
 * Finds relevant articles from the Indian Constitution based on a user query.
 * This is a simplified keyword-based retrieval mechanism.
 * In a real-world application, this would be replaced with a more sophisticated
 * system like a vector database with semantic search.
 * @param query The user's query string. This can be a single query or a newline-separated history of queries.
 * @returns An array of relevant constitution articles.
 */
export function findRelevantArticles(query: string): ConstitutionArticle[] {
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  if (queryWords.length === 0) {
    return [];
  }
  
  const uniqueQueryWords = [...new Set(queryWords)];

  const articleScores: { article: ConstitutionArticle, score: number }[] = indianConstitution.map(article => {
    let score = 0;
    const articleText = `${article.title.toLowerCase()} ${article.text.toLowerCase()}`;
    
    uniqueQueryWords.forEach(word => {
      if (articleText.includes(word)) {
        score++;
      }
    });
    
    // Boost score for title matches
    uniqueQueryWords.forEach(word => {
      if (article.title.toLowerCase().includes(word)) {
        score += 2;
      }
    });

    return { article, score };
  });

  // Filter out articles with a score of 0 and sort by score in descending order
  const relevantArticles = articleScores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.article);
    
  // Return the top 3 most relevant articles
  return relevantArticles.slice(0, 3);
}
