"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/app-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Package, Edit, AlertTriangle, Search, Plus } from "lucide-react"
import { formatNumber, formatCompactCurrency } from "@/lib/format"

export default function InventoryPage() {
  const { products, updateProduct, addProduct } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [stockUpdate, setStockUpdate] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newProductData, setNewProductData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    unitPrice: 0,
    quantityInStock: 0,
  })

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateProduct(productId, { quantityInStock: newStock })
      setEditingProduct(null)
      setStockUpdate(0)
    } catch (error) {
      console.error("Error updating stock:", error)
      alert("Failed to update stock")
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addProduct(newProductData)
      setNewProductData({
        name: "",
        sku: "",
        category: "",
        supplier: "",
        unitPrice: 0,
        quantityInStock: 0,
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalInventoryValue = products.reduce((sum, product) => sum + product.unitPrice * product.quantityInStock, 0)
  const lowStockProducts = products.filter((product) => product.quantityInStock < 10)

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity < 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-sm md:text-base text-muted-foreground">Track and manage your product stock levels</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProductData.name}
                        onChange={(e) => setNewProductData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newProductData.sku}
                        onChange={(e) => setNewProductData((prev) => ({ ...prev, sku: e.target.value }))}
                        placeholder="Enter SKU..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newProductData.category}
                        onChange={(e) => setNewProductData((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="Enter category..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={newProductData.supplier}
                        onChange={(e) => setNewProductData((prev) => ({ ...prev, supplier: e.target.value }))}
                        placeholder="Enter supplier..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitPrice">Unit Price (₦)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProductData.unitPrice}
                        onChange={(e) =>
                          setNewProductData((prev) => ({ ...prev, unitPrice: Number.parseFloat(e.target.value) || 0 }))
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantityInStock">Initial Stock Quantity</Label>
                      <Input
                        id="quantityInStock"
                        type="number"
                        min="0"
                        value={newProductData.quantityInStock}
                        onChange={(e) =>
                          setNewProductData((prev) => ({
                            ...prev,
                            quantityInStock: Number.parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="0"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Adding Product..." : "Add Product"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-4 md:p-6">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 md:p-6 pt-0">
                  <div className="text-2xl font-bold text-primary">{formatNumber(products.length)}</div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-4 md:p-6">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <div className="p-2 bg-accent/10 rounded-full">
                    <Package className="h-4 w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-accent">
                    {formatCompactCurrency(totalInventoryValue)}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-4 md:p-6">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <div className="p-2 bg-destructive/10 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 md:p-6 pt-0">
                  <div className="text-2xl font-bold text-destructive">{formatNumber(lowStockProducts.length)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-destructive text-base md:text-lg">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <span className="font-medium text-sm md:text-base">{product.name}</span>
                        <Badge variant="destructive" className="text-xs">
                          {formatNumber(product.quantityInStock)} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Product Inventory</CardTitle>
                <div className="relative w-full max-w-sm mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="hidden sm:table-cell">SKU</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden lg:table-cell">Supplier</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.quantityInStock)
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium text-sm">{product.name}</TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">{product.sku}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm">{product.category}</TableCell>
                            <TableCell className="hidden lg:table-cell text-sm">{product.supplier}</TableCell>
                            <TableCell className="text-sm">{formatCompactCurrency(product.unitPrice)}</TableCell>
                            <TableCell className="font-bold text-sm">{formatNumber(product.quantityInStock)}</TableCell>
                            <TableCell>
                              <Badge variant={stockStatus.variant} className="text-xs">
                                {stockStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingProduct(product.id)
                                      setStockUpdate(product.quantityInStock)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Update Stock - {product.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="currentStock">Current Stock</Label>
                                      <Input id="currentStock" value={formatNumber(product.quantityInStock)} disabled />
                                    </div>
                                    <div>
                                      <Label htmlFor="newStock">New Stock Quantity</Label>
                                      <Input
                                        id="newStock"
                                        type="number"
                                        min="0"
                                        value={stockUpdate}
                                        onChange={(e) => setStockUpdate(Number.parseInt(e.target.value) || 0)}
                                      />
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg">
                                      <p className="text-sm">
                                        <span className="font-medium">Change: </span>
                                        <span
                                          className={
                                            stockUpdate > product.quantityInStock
                                              ? "text-green-600"
                                              : "text-destructive"
                                          }
                                        >
                                          {stockUpdate > product.quantityInStock ? "+" : ""}
                                          {formatNumber(stockUpdate - product.quantityInStock)}
                                        </span>
                                      </p>
                                    </div>
                                    <Button
                                      onClick={() => handleStockUpdate(product.id, stockUpdate)}
                                      className="w-full"
                                    >
                                      Update Stock
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
