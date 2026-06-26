import { createContext, useContext, useState } from 'react'
import booksData from '../data/booksData.js'

const BooksContext = createContext(null)
const STORAGE_KEY = 'arBooks'

function loadBooks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(stored) && stored.length > 0) return stored
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(booksData))
  return booksData
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(loadBooks)

  function addBook(book) {
    const updated = [book, ...books]
    saveBooks(updated)
    setBooks(updated)
  }

  function updateBook(id, updatedBook) {
    const updated = books.map(b => b.id === id ? updatedBook : b)
    saveBooks(updated)
    setBooks(updated)
  }

  return (
    <BooksContext.Provider value={{ books, addBook, updateBook }}>
      {children}
    </BooksContext.Provider>
  )
}

export function useBooksContext() {
  const ctx = useContext(BooksContext)
  if (!ctx) throw new Error('useBooksContext must be used inside BooksProvider')
  return ctx
}
