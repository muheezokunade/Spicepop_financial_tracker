"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApp } from "@/components/app-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Plus, Search } from "lucide-react"
import { formatCurrency } from "@/lib/format"

export default function SalesPage() {
  const { sales, products, addSale } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    productId: "",
    quantity: 1,
    unitPrice: 0,
  })

  const selectedProduct = products.find((p) => p.id === formData.productId)

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    setFormData((prev) => ({
      ...prev,
      productId,
      unitPrice: product?.unitPrice || 0,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const totalAmount = formData.quantity * formData.unitPrice

    addSale({
      date: formData.date,
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalAmount,
    })

    setFormData({
      date: new Date().toISOString().split("T")[0],
      productId: "",
      quantity: 1,
      unitPrice: 0,
    })
    setIsDialogOpen(false)
  }

  const filteredSales = sales.filter(
    (sale) => sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) || sale.date.includes(searchTerm),
  )

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sales & Revenue</h1>
                <p className="text-muted-foreground">Track and manage all your sales transactions</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Sale
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sale</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product">Product</Label>
                      <Select value={formData.productId} onValueChange={handleProductChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.unitPrice)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity Sold</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitPrice">Unit Price</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.unitPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, unitPrice: Number.parseFloat(e.target.value) }))
                        }
                        required
                      />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium">
                        Total Sale Amount:{" "}
                        <span className="text-primary font-bold">
                          {formatCurrency(formData.quantity * formData.unitPrice)}
                        </span>
                      </p>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Sale
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                  Sales Overview
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</span>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{sale.productName}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                        <TableCell className="font-bold text-primary">{formatCurrency(sale.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
