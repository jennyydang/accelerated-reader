import { createContext, useContext, useState, useEffect } from 'react'
import booksData from '../data/booksData.js'
import { supabase } from '../lib/supabase.js'

const BooksContext = createContext(null)
const LS_KEY = 'arBooks'
const DB_KEY = 'books'

function getCachedBooks() {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY))
    if (Array.isArray(stored) && stored.length > 0) return stored
  } catch {}
  return booksData
}

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(getCachedBooks)

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('books_store')
      .select('value')
      .eq('key', DB_KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return
        if (!data) {
          // First run: seed Supabase with the default book list
          supabase.from('books_store').insert({ key: DB_KEY, value: booksData }).then()
          return
        }
        const loaded = Array.isArray(data.value) && data.value.length > 0
          ? data.value
          : booksData
        setBooks(loaded)
        localStorage.setItem(LS_KEY, JSON.stringify(loaded))
      })
  }, [])

  function persist(updated) {
    setBooks(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    if (supabase) {
      supabase.from('books_store').upsert({ key: DB_KEY, value: updated }).then()
    }
  }

  function addBook(book) {
    persist([book, ...books])
  }

  function updateBook(id, updatedBook) {
    persist(books.map(b => b.id === id ? updatedBook : b))
  }

  function removeBook(id) {
    persist(books.filter(b => b.id !== id))
  }

  return (
    <BooksContext.Provider value={{ books, addBook, updateBook, removeBook }}>
      {children}
    </BooksContext.Provider>
  )
}

export function useBooksContext() {
  const ctx = useContext(BooksContext)
  if (!ctx) throw new Error('useBooksContext must be used inside BooksProvider')
  return ctx
}
