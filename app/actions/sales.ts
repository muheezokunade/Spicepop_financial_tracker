"use server"

import { sql } from "@/lib/database"
import { revalidatePath } from "next/cache"

export async function addSale(formData: FormData) {
  const date = formData.get("date") as string
  const productId = formData.get("productId") as string
  const productName = formData.get("productName") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unitPrice = Number.parseFloat(formData.get("unitPrice") as string)
  const totalAmount = quantity * unitPrice

  try {
    await sql`
      INSERT INTO sales (date, product_id, product_name, quantity, unit_price, total_amount)
      VALUES (${date}, ${productId}, ${productName}, ${quantity}, ${unitPrice}, ${totalAmount})
    `

    // Update product stock
    await sql`
      UPDATE products 
      SET quantity_in_stock = quantity_in_stock - ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
    `

    // Revalidate all pages that show sales data
    revalidatePath("/")
    revalidatePath("/sales")
    revalidatePath("/inventory")
    revalidatePath("/reports")

    return { success: true }
  } catch (error) {
    console.error("Error adding sale:", error)
    return { success: false, error: "Failed to add sale" }
  }
}

export async function bulkAddSales() {
  const salesData = [
    { date: "2025-05-03", productId: "1", productName: "Spice Mix Original", quantity: 10, unitPrice: 2500.0 },
    { date: "2025-05-04", productId: "2", productName: "Spice Mix Hot", quantity: 5, unitPrice: 2500.0 },
    { date: "2025-05-05", productId: "1", productName: "Spice Mix Original", quantity: 8, unitPrice: 2500.0 },
  ]

  try {
    // Insert all sales in a transaction
    for (const sale of salesData) {
      const totalAmount = sale.quantity * sale.unitPrice
      
      await sql`
        INSERT INTO sales (date, product_id, product_name, quantity, unit_price, total_amount)
        VALUES (${sale.date}, ${sale.productId}, ${sale.productName}, ${sale.quantity}, ${sale.unitPrice}, ${totalAmount})
      `

      // Update product stock
      await sql`
        UPDATE products 
        SET quantity_in_stock = quantity_in_stock - ${sale.quantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${sale.productId}
      `
    }

    // Revalidate all pages that show sales data
    revalidatePath("/")
    revalidatePath("/sales")
    revalidatePath("/inventory")
    revalidatePath("/reports")

    return { success: true, count: salesData.length }
  } catch (error) {
    console.error("Error bulk adding sales:", error)
    return { success: false, error: "Failed to bulk add sales" }
  }
}
