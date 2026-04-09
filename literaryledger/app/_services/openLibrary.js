// librarian ready to fetch and clean book data from Open Library API

const BASE_URL = "https://openlibrary.org";

/**
 * Searches Open Library by title and returns a cleaned array of books.
 */
export const searchBooks = async (query, limit = 12) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?title=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("The library archives are currently unreachable.");
    }

    const data = await response.json();

    // Map through the docs and clean them up
    return data.docs.map((book) => ({
      bookId: book.key ? book.key.replace("/works/", "") : Math.random().toString(36),
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown Author",
      coverId: book.cover_i || null,
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
        : null,
      firstPublished: book.first_publish_year || "Date Unknown",
    }));
  } catch (error) {
    console.error("Librarian Error:", error);
    return [];
  }
};