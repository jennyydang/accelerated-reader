import { createContext, useContext, useState } from 'react'
import booksData from '../data/booksData.js'

const BooksContext = createContext(null)

function loadCustomBooks() {
  try {
    return JSON.parse(localStorage.getItem('customBooks') || '[]')
  } catch {
    return []
  }
}

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(() => [...booksData, ...loadCustomBooks()])

  function addBook(book) {
    const updated = [...loadCustomBooks(), book]
    localStorage.setItem('customBooks', JSON.stringify(updated))
    setBooks([...booksData, ...updated])
  }

  return (
    <BooksContext.Provider value={{ books, addBook }}>
      {children}
    </BooksContext.Provider>
  )
}

export function useBooksContext() {
  const ctx = useContext(BooksContext)
  if (!ctx) throw new Error('useBooksContext must be used inside BooksProvider')
  return ctx
}
