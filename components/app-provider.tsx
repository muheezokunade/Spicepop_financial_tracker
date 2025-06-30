"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { DbProduct, DbSale, DbExpense, DbCategory } from "@/lib/db-types"
import { addExpense, bulkAddExpenses } from "@/app/actions/expenses"
import { addCategory, updateCategory, deleteCategory } from "@/app/actions/categories"
import { addProduct, updateProductStock, deleteProduct } from "@/app/actions/products"
import { addSale, bulkAddSales } from "@/app/actions/sales"

/* ---------- Public-facing (UI) types ---------- */
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  supplier: string
  unitPrice: number
  quantityInStock: number
}
export interface Sale {
  id: string
  date: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalAmount: number
}
export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
}
export interface Category {
  id: string
  name: string
  monthlyBudget: number
}

interface AppContextType {
  loading: boolean
  connectionError: boolean
  products: Product[]
  sales: Sale[]
  expenses: Expense[]
  categories: Category[]
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  bulkAddExpenses: () => Promise<void>
  addSale: (sale: Omit<Sale, "id">) => Promise<void>
  bulkAddSales: () => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<void>
  updateCategory: (id: string, category: Omit<Category, "id">) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  refreshData: (isRetry?: boolean) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

/* ---------- helpers to convert DB → UI ---------- */
const mapProduct = (p: DbProduct): Product => ({
  id: p.id.toString(),
  name: p.name,
  sku: p.sku,
  category: p.category,
  supplier: p.supplier,
  unitPrice: Number(p.unit_price),
  quantityInStock: p.quantity_in_stock,
})
const mapSale = (s: DbSale): Sale => ({
  id: s.id?.toString(),
  date: s.date,
  productId: s.product_id != null ? s.product_id.toString() : "",
  productName: s.product_name ?? "",
  quantity: s.quantity ?? 0,
  unitPrice: Number(s.unit_price ?? 0),
  totalAmount: Number(s.total_amount ?? 0),
})
const mapExpense = (e: DbExpense): Expense => ({
  id: e.id.toString(),
  date: e.date,
  category: e.category,
  description: e.description,
  amount: Number(e.amount),
})
const mapCategory = (c: DbCategory): Category => ({
  id: c.id.toString(),
  name: c.name,
  monthlyBudget: Number(c.monthly_budget),
})

/* ---------- CLIENT Provider ---------- */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [connectionError, setConnectionError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const refreshData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true)
    }
    
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const res = await fetch(`/api/initial-data?t=${timestamp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`/api/initial-data ${res.status}: ${errorText}`)
      }

      const json = (await res.json()) as {
        products: DbProduct[]
        sales: DbSale[]
        expenses: DbExpense[]
        categories: DbCategory[]
      }

      setProducts(json.products.map(mapProduct))
      setSales(json.sales.map(mapSale))
      setExpenses(json.expenses.map(mapExpense))
      setCategories(json.categories.map(mapCategory))
      setConnectionError(false)
      setRetryCount(0)
    } catch (e) {
      console.warn("Error fetching data:", e)
      setConnectionError(true)
      
      // Only clear data if this is the initial load
      if (!isRetry && (products.length === 0 && sales.length === 0 && expenses.length === 0 && categories.length === 0)) {
        setProducts([])
        setSales([])
        setExpenses([])
        setCategories([])
      }
    } finally {
      setLoading(false)
    }
  }, [products.length, sales.length, expenses.length, categories.length])

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    const formData = new FormData()
    formData.append("date", expense.date)
    formData.append("category", expense.category)
    formData.append("description", expense.description)
    formData.append("amount", expense.amount.toString())

    const result = await addExpense(formData)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleBulkAddExpenses = async () => {
    const result = await bulkAddExpenses()
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleAddSale = async (sale: Omit<Sale, "id">) => {
    const formData = new FormData()
    formData.append("date", sale.date)
    formData.append("productId", sale.productId)
    formData.append("productName", sale.productName)
    formData.append("quantity", sale.quantity.toString())
    formData.append("unitPrice", sale.unitPrice.toString())

    const result = await addSale(formData)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleBulkAddSales = async () => {
    const result = await bulkAddSales()
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleAddCategory = async (category: Omit<Category, "id">) => {
    const formData = new FormData()
    formData.append("name", category.name)
    formData.append("monthlyBudget", category.monthlyBudget.toString())

    const result = await addCategory(formData)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleUpdateCategory = async (id: string, category: Omit<Category, "id">) => {
    const formData = new FormData()
    formData.append("name", category.name)
    formData.append("monthlyBudget", category.monthlyBudget.toString())

    const result = await updateCategory(id, formData)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteCategory(id)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    const formData = new FormData()
    formData.append("name", product.name)
    formData.append("sku", product.sku)
    formData.append("category", product.category)
    formData.append("supplier", product.supplier)
    formData.append("unitPrice", product.unitPrice.toString())
    formData.append("quantityInStock", product.quantityInStock.toString())

    const result = await addProduct(formData)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    if (updates.quantityInStock !== undefined) {
      const result = await updateProductStock(id, updates.quantityInStock)
      if (result.success) {
        await refreshData()
      } else {
        throw new Error(result.error)
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id)
    if (result.success) {
      await refreshData()
    } else {
      throw new Error(result.error)
    }
  }

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Smart auto-refresh: longer intervals if there are connection issues
  useEffect(() => {
    const getRefreshInterval = () => {
      if (connectionError) {
        // Exponential backoff: 2min, 4min, 8min, max 10min
        return Math.min(120000 * Math.pow(2, retryCount), 600000)
      }
      return 120000 // 2 minutes when connection is stable
    }

    const interval = setInterval(() => {
      if (!loading) {
        refreshData(true) // Mark as retry
        if (connectionError) {
          setRetryCount(prev => prev + 1)
        }
      }
    }, getRefreshInterval())

    return () => clearInterval(interval)
  }, [loading, refreshData, connectionError, retryCount])

  return (
    <AppContext.Provider
      value={{
        loading,
        connectionError,
        products,
        sales,
        expenses,
        categories,
        addExpense: handleAddExpense,
        bulkAddExpenses: handleBulkAddExpenses,
        addSale: handleAddSale,
        bulkAddSales: handleBulkAddSales,
        addCategory: handleAddCategory,
        updateCategory: handleUpdateCategory,
        deleteCategory: handleDeleteCategory,
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>")
  return ctx
}
