"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/components/app-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/format"

export default function ReportsPage() {
  const { sales, expenses, products } = useApp()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = ["2023", "2024", "2025"]

  // Filter data for selected period
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date)
    return (
      saleDate.getMonth() === Number.parseInt(selectedMonth) && saleDate.getFullYear() === Number.parseInt(selectedYear)
    )
  })

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === Number.parseInt(selectedMonth) &&
      expenseDate.getFullYear() === Number.parseInt(selectedYear)
    )
  })

  // Calculate metrics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate COGS (simplified - using 60% of revenue as example)
  const costOfGoodsSold = totalRevenue * 0.6
  const grossProfit = totalRevenue - costOfGoodsSold
  const netProfit = totalRevenue - totalExpenses

  // Top selling products for the period
  const productSales = filteredSales.reduce(
    (acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  const topSellingProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Expense breakdown
  const expensesByCategory = filteredExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const handleExportPDF = () => {
    // In a real app, you would implement PDF generation here
    alert("PDF export functionality would be implemented here")
  }

  const handleExportCSV = () => {
    // In a real app, you would implement CSV export here
    alert("CSV export functionality would be implemented here")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground">Detailed monthly financial summaries and insights</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={handleExportPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Period Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Reporting Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  Financial Summary - {months[Number.parseInt(selectedMonth)]} {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-destructive/5 to-destructive/10">
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <span className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10">
                    <p className="text-sm font-medium text-muted-foreground">Cost of Goods Sold</p>
                    <span className="text-2xl font-bold text-accent">{formatCurrency(costOfGoodsSold)}</span>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-green-500/10">
                    <p className="text-sm font-medium text-muted-foreground">Gross Profit</p>
                    <span className={`text-2xl font-bold ${grossProfit >= 0 ? "text-green-600" : "text-destructive"}`}>
                      {formatCurrency(grossProfit)}
                    </span>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <span className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-destructive"}`}>
                      {formatCurrency(netProfit)}
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
