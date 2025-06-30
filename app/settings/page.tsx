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
import { Plus, Edit, Trash2, Settings } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/format"

export default function SettingsPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    monthlyBudget: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory, formData)
      } else {
        await addCategory(formData)
      }

      setFormData({ name: "", monthlyBudget: 0 })
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Failed to save category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category.id)
    setFormData({
      name: category.name,
      monthlyBudget: category.monthlyBudget,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId)
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category")
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: "", monthlyBudget: 0 })
    setEditingCategory(null)
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-sm md:text-base text-muted-foreground">Manage expense categories and budgets</p>
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter category name..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Monthly Budget (₦)</Label>
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.monthlyBudget}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, monthlyBudget: Number.parseFloat(e.target.value) || 0 }))
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Settings className="h-5 w-5" />
                  Categories & Budgets
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Monthly Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="font-bold text-primary">
                            {formatCurrency(category.monthlyBudget)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Budget Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                    <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                    <span className="text-2xl font-bold text-primary">{formatNumber(categories.length)}</span>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10">
                    <p className="text-sm font-medium text-muted-foreground">Total Monthly Budget</p>
                    <span className="text-2xl font-bold text-accent">
                      {formatCurrency(categories.reduce((sum, cat) => sum + cat.monthlyBudget, 0))}
                    </span>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
                    <p className="text-sm font-medium text-muted-foreground">Average Budget per Category</p>
                    <span className="text-2xl font-bold text-secondary">
                      {categories.length > 0
                        ? formatCurrency(
                            categories.reduce((sum, cat) => sum + cat.monthlyBudget, 0) / categories.length,
                          )
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
