
const express = require("express");
const axios = require("axios");

const public_users = express.Router();

const API_URL = "https://www.googleapis.com/books/v1/volumes";

// Get all books
public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            params: { q: "books", maxResults: 40 }
        });

        const books = response.data.items || [];

        if (books.length === 0) {
            return res.status(404).json({
                message: "No books found"
            });
        }

        return res.status(200).json(books);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author;

        const response = await axios.get(API_URL, {
            params: { q: `inauthor:${author}`, maxResults: 40 }
        });

        const books = (response.data.items || []).filter(book =>
            (book.volumeInfo.authors || []).some(a =>
                a.toLowerCase().includes(author.toLowerCase())
            )
        );

        if (books.length === 0) {
            return res.status(404).json({
                message: "Books by this author not found"
            });
        }

        return res.status(200).json(books);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title;

        const response = await axios.get(API_URL, {
            params: { q: `intitle:${title}`, maxResults: 40 }
        });

        const books = (response.data.items || []).filter(book =>
            (book.volumeInfo.title || "")
                .toLowerCase()
                .includes(title.toLowerCase())
        );

        if (books.length === 0) {
            return res.status(404).json({
                message: "Book with this title not found"
            });
        }

        return res.status(200).json(books);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title",
            error: error.message
        });
    }
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(API_URL, {
            params: { q: `isbn:${isbn}`, maxResults: 40 }
        });

        const books = (response.data.items || []).filter(book =>
            (book.volumeInfo.industryIdentifiers || []).some(
                id => id.identifier.replace(/[-\s]/g, "") ===
                      isbn.replace(/[-\s]/g, "")
            )
        );

        if (books.length === 0) {
            return res.status(404).json({
                message: "Book with this ISBN not found"
            });
        }

        return res.status(200).json(books);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book by ISBN",
            error: error.message
        });
    }
});

module.exports = public_users;
