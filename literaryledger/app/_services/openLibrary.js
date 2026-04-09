// Librarian ready to fetch and clean book data from Open Library API
const BASE_URL = "https://openlibrary.org";

// Searches Open Library by title and returns a cleaned array of books.
export const searchBooks = async (query, limit = 12) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?title=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("The ledger is currently unreachable.");
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

export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/works/${bookId}.json`);
    if (!response.ok) throw new Error("Could not find book details");
    
    const data = await response.json();

    let rawDescription = "No description available in the archives.";
    if (data.description) {
      rawDescription = typeof data.description === 'string' 
        ? data.description 
        : data.description.value;
    }

    const cleanDescription = rawDescription
      .replace(/https?:\/\/[^\s]+/g, '')        // Removes URLs
      .replace(/\[.*?\]/g, '')                  // Removes square brackets
      .replace(/\(.*?\)/g, '')                  // Removes parentheses
      .replace(/\*\*(.*?)\*\*/g, '')            // Removes Markdown bolding like **Contains**
      .replace(/^[ \t]*[-:]([ \t]*[-:])*/gm, '') // Removes lines starting with - or : or combinations
      .replace(/-{2,}/g, '')                    // Removes long dashes -----
      .split(/See also:/i)[0]                   // Cuts off "See also" sections
      .trim();                                  // Final trim

    return {
      title: data.title,
      description: cleanDescription,
      subjects: data.subjects ? data.subjects.slice(0, 5) : [],
      coverUrl: data.covers ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : null,
    };
  } catch (error) {
    console.error("Detail Fetch Error:", error);
    return null;
  }
};