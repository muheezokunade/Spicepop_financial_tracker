"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string
  const sku = formData.get("sku") as string
  const category = formData.get("category") as string
  const supplier = formData.get("supplier") as string
  const unitPrice = Number.parseFloat(formData.get("unitPrice") as string)
  const quantityInStock = Number.parseInt(formData.get("quantityInStock") as string)

  try {
    await sql`
      INSERT INTO products (name, sku, category, supplier, unit_price, quantity_in_stock)
      VALUES (${name}, ${sku}, ${category}, ${supplier}, ${unitPrice}, ${quantityInStock})
    `

    revalidatePath("/")
    revalidatePath("/inventory")
    revalidatePath("/sales")
    return { success: true }
  } catch (error) {
    console.error("Error adding product:", error)
    return { success: false, error: "Failed to add product" }
  }
}

export async function updateProductStock(productId: string, newStock: number) {
  try {
    await sql`
      UPDATE products 
      SET quantity_in_stock = ${newStock}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
    `

    revalidatePath("/")
    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error updating product stock:", error)
    return { success: false, error: "Failed to update stock" }
  }
}
