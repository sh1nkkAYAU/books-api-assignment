
const axios = require("axios");

const API_URL = "https://www.googleapis.com/books/v1/volumes";

async function getBooks({ author, title, isbn }) {
  let query = [];

  if (author) query.push(`inauthor:${author}`);
  if (title) query.push(`intitle:${title}`);
  if (isbn) query.push(`isbn:${isbn}`);

  if (query.length === 0) {
    throw new Error("Please provide author, title, or ISBN");
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query.join("+"),
        maxResults: 40
      }
    });

    return (response.data.items || []).map(book => {
      const info = book.volumeInfo || {};
      const ids = info.industryIdentifiers || [];

      return {
        title: info.title,
        authors: info.authors,
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        description: info.description,
        pageCount: info.pageCount,
        ISBN10: ids.find(x => x.type === "ISBN_10")?.identifier,
        ISBN13: ids.find(x => x.type === "ISBN_13")?.identifier
      };
    });

  } catch (error) {
    console.error("Error retrieving books:", error.message);
    throw error;
  }
}

module.exports = { getBooks };
