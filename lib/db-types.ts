export interface DbProduct {
  id: number
  name: string
  sku: string
  category: string
  supplier: string
  unit_price: string
  quantity_in_stock: number
  created_at: string
  updated_at: string
}

export interface DbSale {
  id: number
  date: string
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  total_amount: string
  created_at: string
}

export interface DbExpense {
  id: number
  date: string
  category: string
  description: string
  amount: string
  created_at: string
}

export interface DbCategory {
  id: number
  name: string
  monthly_budget: string
  created_at: string
  updated_at: string
}
