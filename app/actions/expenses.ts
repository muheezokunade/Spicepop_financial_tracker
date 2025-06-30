"use server"

import { sql } from "@/lib/database"
import { revalidatePath } from "next/cache"

export async function addExpense(formData: FormData) {
  const date = formData.get("date") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const amount = Number.parseFloat(formData.get("amount") as string)

  try {
    await sql`
      INSERT INTO expenses (date, category, description, amount)
      VALUES (${date}, ${category}, ${description}, ${amount})
    `

    // Revalidate all pages that show expense data
    revalidatePath("/")
    revalidatePath("/expenses")
    revalidatePath("/reports")

    return { success: true }
  } catch (error) {
    console.error("Error adding expense:", error)
    return { success: false, error: "Failed to add expense" }
  }
}

export async function bulkAddExpenses() {
  const expenses = [
    { date: "2025-05-03", category: "Packaging", description: "Ziplock bag", amount: 2500.0 },
    { date: "2025-05-03", category: "Packaging", description: "Ziplock bag", amount: 2500.0 },
    { date: "2025-05-03", category: "Packaging", description: "Ziplock bag", amount: 2000.0 },
    { date: "2025-05-03", category: "Packaging", description: "Ziplock bag", amount: 20000.0 },
    { date: "2025-05-03", category: "Packaging", description: "Bottles", amount: 4000.0 },
    { date: "2025-05-03", category: "Logistics", description: "Delivery ibadan", amount: 15000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "chili pepper", amount: 7000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Kilishi", amount: 60000.0 },
    { date: "2025-05-03", category: "Asset", description: "scale", amount: 22000.0 },
    { date: "2025-05-03", category: "Asset", description: "Seal Gun", amount: 25000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Bag", amount: 1000.0 },
    { date: "2025-05-03", category: "Packaging", description: "Bottles", amount: 4000.0 },
    { date: "2025-05-03", category: "Packaging", description: "Seal nylon", amount: 1000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "chili pepper", amount: 2000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Ginger", amount: 13000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Garlic", amount: 5000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Oninin Flakes", amount: 5000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "All Spice", amount: 9000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Kulikuli", amount: 10000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Coriander", amount: 7000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Negro Pepper", amount: 2000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Grinding", amount: 2000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Clove", amount: 10000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Dried Iru", amount: 6000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "African Nutmeg", amount: 9000.0 },
    { date: "2025-05-03", category: "Logistics", description: "Delivery from Ibadan", amount: 5000.0 },
    { date: "2025-05-03", category: "Packaging", description: "Seal Nylon", amount: 3500.0 },
    { date: "2025-05-03", category: "Packaging", description: "Carton", amount: 25000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Catfish", amount: 54500.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Yam", amount: 36000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "10kg Rice", amount: 48000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "2 congo of Rice", amount: 11000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Spagg", amount: 38000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Beans", amount: 42000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Veg.oil", amount: 52000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Semo", amount: 15600.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Garri", amount: 19200.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Milo s", amount: 10500.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Milo b", amount: 13400.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Milk s", amount: 12600.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Milk b", amount: 18600.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "3-in-1 Custard", amount: 23200.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Knorr", amount: 14000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Salt", amount: 4200.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Panla", amount: 10000.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Garri", amount: 4800.0 },
    { date: "2025-05-03", category: "Raw Materials", description: "Spagg", amount: 10000.0 },
    { date: "2025-06-03", category: "Raw Materials", description: "Paid myself", amount: 6000.0 },
    { date: "2025-06-10", category: "Marketing", description: "Data", amount: 5000.0 },
    { date: "2025-06-11", category: "Marketing", description: "Airtime", amount: 500.0 },
    { date: "2025-06-24", category: "Marketing", description: "Paid Ad", amount: 2200.0 },
    { date: "2025-06-28", category: "Raw Materials", description: "mummy's salary", amount: 5000.0 },
  ]

  try {
    // Clear existing expenses first
    await sql`DELETE FROM expenses`

    // Insert all expenses in a single transaction
    for (const expense of expenses) {
      await sql`
        INSERT INTO expenses (date, category, description, amount)
        VALUES (${expense.date}, ${expense.category}, ${expense.description}, ${expense.amount})
      `
    }

    // Revalidate all pages that show expense data
    revalidatePath("/")
    revalidatePath("/expenses")
    revalidatePath("/reports")

    return { success: true, count: expenses.length }
  } catch (error) {
    console.error("Error bulk adding expenses:", error)
    return { success: false, error: "Failed to bulk add expenses" }
  }
}
