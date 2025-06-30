"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string
  const monthlyBudget = Number.parseFloat(formData.get("monthlyBudget") as string)

  try {
    await sql`
      INSERT INTO categories (name, monthly_budget)
      VALUES (${name}, ${monthlyBudget})
    `

    revalidatePath("/")
    revalidatePath("/settings")
    revalidatePath("/expenses")
    return { success: true }
  } catch (error) {
    console.error("Error adding category:", error)
    return { success: false, error: "Failed to add category" }
  }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const name = formData.get("name") as string
  const monthlyBudget = Number.parseFloat(formData.get("monthlyBudget") as string)

  try {
    await sql`
      UPDATE categories 
      SET name = ${name}, monthly_budget = ${monthlyBudget}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${categoryId}
    `

    revalidatePath("/")
    revalidatePath("/settings")
    revalidatePath("/expenses")
    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await sql`DELETE FROM categories WHERE id = ${categoryId}`

    revalidatePath("/")
    revalidatePath("/settings")
    revalidatePath("/expenses")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}
