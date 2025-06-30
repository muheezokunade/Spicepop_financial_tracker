import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    /* 🚀 Try the real database first */
    const [productsResult, salesResult, expensesResult, categoriesResult] = await Promise.all([
      sql`SELECT * FROM products ORDER BY name`,
      sql`SELECT * FROM sales ORDER BY date DESC`,
      sql`SELECT * FROM expenses ORDER BY date DESC`,
      sql`SELECT * FROM categories ORDER BY name`,
    ])

    return NextResponse.json(
      { 
        products: productsResult.rows, 
        sales: salesResult.rows, 
        expenses: expensesResult.rows, 
        categories: categoriesResult.rows 
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (err) {
    /* 🛟 Graceful fallback for Preview / local-only runs */
    console.error("⛔ API /initial-data failed – falling back to empty data:", err)

    return NextResponse.json({ products: [], sales: [], expenses: [], categories: [] }, { status: 200 })
  }
}
