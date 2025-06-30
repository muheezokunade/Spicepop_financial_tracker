"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/components/app-provider"
import { DollarSign, TrendingUp, TrendingDown, Package } from "lucide-react"
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"

export default function Dashboard() {
  const { sales, expenses, products, loading } = useApp()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <LoadingSpinner />
          </main>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const totalInventoryValue = products.reduce((sum, product) => sum + product.unitPrice * product.quantityInStock, 0)

  // Monthly revenue vs expenses data - dynamically calculated from actual data
  const getMonthlyData = () => {
    // Group sales by month
    const monthlyRevenue: Record<string, number> = {}
    sales.forEach((sale) => {
      const date = new Date(sale.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + sale.totalAmount
    })

    // Group expenses by month
    const monthlyExpenses: Record<string, number> = {}
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + expense.amount
    })

    // Get all unique months and sort them
    const allMonths = new Set([...Object.keys(monthlyRevenue), ...Object.keys(monthlyExpenses)])
    const sortedMonths = Array.from(allMonths).sort()

    // If no data, show the last 6 months with zeros
    if (sortedMonths.length === 0) {
      const monthNames = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]
      return monthNames.map(month => ({ month, revenue: 0, expenses: 0 }))
    }

    // Convert to display format
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-')
      const monthIndex = parseInt(month) - 1
      const monthName = monthNames[monthIndex]
      const displayMonth = year === new Date().getFullYear().toString() ? monthName : `${monthName} ${year.slice(2)}`
      
      return {
        month: displayMonth,
        revenue: monthlyRevenue[monthKey] || 0,
        expenses: monthlyExpenses[monthKey] || 0
      }
    })
  }

  const monthlyData = getMonthlyData()

  // Expense breakdown by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  // Top 5 best-selling products
  const productSales = sales.reduce(
    (acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.totalAmount
      return acc
    },
    {} as Record<string, number>,
  )

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue }))

  const COLORS = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === "revenue" ? "Revenue" : "Expenses"}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here's your business overview.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
                  <div className="p-1.5 md:p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-3 md:p-6 pt-0">
                  <div className="text-lg md:text-2xl font-bold text-primary">
                    {formatCompactCurrency(totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">Ready to track sales</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Expenses</CardTitle>
                  <div className="p-1.5 md:p-2 bg-destructive/10 rounded-full">
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-3 md:p-6 pt-0">
                  <div className="text-lg md:text-2xl font-bold text-destructive">
                    {formatCompactCurrency(totalExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">Ready to track expenses</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Net Profit</CardTitle>
                  <div className="p-1.5 md:p-2 bg-green-500/10 rounded-full">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-3 md:p-6 pt-0">
                  <div
                    className={`text-lg md:text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-destructive"}`}
                  >
                    {formatCompactCurrency(netProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">Fresh start</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Inventory Value</CardTitle>
                  <div className="p-1.5 md:p-2 bg-accent/10 rounded-full">
                    <Package className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="relative p-3 md:p-6 pt-0">
                  <div className="text-lg md:text-2xl font-bold text-accent">
                    {formatCompactCurrency(totalInventoryValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">{products.length} products available</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
              <Card className="shadow-lg">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <div className="w-2 h-4 md:h-6 bg-gradient-to-b from-primary to-destructive rounded-full" />
                    Revenue vs Expenses (By Month)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250} className="md:h-[350px]">
                    <AreaChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickFormatter={(value) => formatCompactCurrency(value)}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                        name="Revenue"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="hsl(var(--destructive))"
                        fillOpacity={1}
                        fill="url(#expenseGradient)"
                        name="Expenses"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <div className="w-2 h-4 md:h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full" />
                    Expenses by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  {pieData.length > 0 ? (
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                      {/* Pie Chart */}
                      <div className="flex-shrink-0">
                        <ResponsiveContainer width={280} height={280}>
                          <PieChart>
                            <defs>
                              {COLORS.map((color, index) => (
                                <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                </linearGradient>
                              ))}
                              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                              </filter>
                            </defs>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              innerRadius={45}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="hsl(var(--background))"
                              strokeWidth={3}
                              filter="url(#shadow)"
                            >
                              {pieData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={`url(#gradient${index % COLORS.length})`}
                                  className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Custom Legend */}
                      <div className="flex-1 min-w-0">
                        <div className="grid gap-3 max-h-[280px] overflow-y-auto pr-2">
                          {pieData.map((entry, index) => {
                            const percentage = ((entry.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)
                            return (
                              <div 
                                key={`legend-${index}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/30 to-transparent hover:from-muted/50 transition-all duration-200 border border-border/20"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div 
                                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                                    style={{ 
                                      background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}99)`
                                    }}
                                  />
                                  <span className="font-medium text-foreground text-sm truncate">
                                    {entry.name}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <div className="font-bold text-primary text-sm">
                                    {formatCompactCurrency(entry.value)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {percentage}%
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Total Summary */}
                        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">Total Expenses</span>
                            <span className="font-bold text-primary text-lg">
                              {formatCompactCurrency(pieData.reduce((sum, item) => sum + item.value, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                      <div className="text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-base">No expenses recorded yet</p>
                        <p className="text-sm">Start adding expenses to see the breakdown</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card className="shadow-lg">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <div className="w-2 h-4 md:h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  Top 5 Best-Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {topProducts.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-transparent hover:from-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white text-xs md:text-sm font-bold ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : index === 1
                                  ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                  : index === 2
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                    : "bg-gradient-to-br from-primary to-primary/80"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-sm md:text-base">{product.name}</span>
                            <div className="text-xs text-muted-foreground">Best seller</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-primary text-sm md:text-lg">
                            {formatCompactCurrency(product.revenue)}
                          </span>
                          <div className="text-xs text-muted-foreground">Total revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm md:text-base">No sales recorded yet</p>
                      <p className="text-xs md:text-sm">Start making sales to see your top products</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
