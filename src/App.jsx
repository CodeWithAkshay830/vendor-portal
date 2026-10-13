import { useEffect, useMemo, useState } from 'react'
import Dexie from 'dexie'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import './App.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler)

const db = new Dexie('vendorVisionDB')

db.version(1).stores({
  sales: '++id, date, vendorName, product, category, paymentMode, customerType',
  inventory: '++id, product, category, stock, unitPrice, reorderLevel',
})

const formatCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const initialInventory = [
  { product: 'Rice Bag', category: 'Groceries', stock: 35, unitPrice: 42, reorderLevel: 12 },
  { product: 'Milk', category: 'Daily Essentials', stock: 18, unitPrice: 28, reorderLevel: 10 },
  { product: 'Banana', category: 'Fruits', stock: 9, unitPrice: 40, reorderLevel: 15 },
  { product: 'Soap', category: 'Household', stock: 22, unitPrice: 32, reorderLevel: 10 },
  { product: 'Bread', category: 'Bakery', stock: 14, unitPrice: 45, reorderLevel: 8 },
  { product: 'Tea Leaves', category: 'Beverages', stock: 12, unitPrice: 90, reorderLevel: 7 },
]

const initialSales = [
  { date: '2026-10-09', vendorName: 'Local Mart', product: 'Rice Bag', category: 'Groceries', quantity: 4, price: 42, paymentMode: 'UPI', customerType: 'Walk-in' },
  { date: '2026-10-09', vendorName: 'Daily Needs', product: 'Milk', category: 'Daily Essentials', quantity: 6, price: 28, paymentMode: 'Cash', customerType: 'Repeat Buyer' },
  { date: '2026-10-10', vendorName: 'Fresh Corner', product: 'Banana', category: 'Fruits', quantity: 8, price: 40, paymentMode: 'Card', customerType: 'Walk-in' },
  { date: '2026-10-10', vendorName: 'Home Essentials', product: 'Soap', category: 'Household', quantity: 5, price: 32, paymentMode: 'UPI', customerType: 'Bulk Buyer' },
  { date: '2026-10-11', vendorName: 'Family Store', product: 'Bread', category: 'Bakery', quantity: 10, price: 45, paymentMode: 'Cash', customerType: 'Repeat Buyer' },
  { date: '2026-10-11', vendorName: 'Tea Hub', product: 'Tea Leaves', category: 'Beverages', quantity: 3, price: 90, paymentMode: 'UPI', customerType: 'Walk-in' },
  { date: '2026-10-12', vendorName: 'Daily Needs', product: 'Rice Bag', category: 'Groceries', quantity: 7, price: 42, paymentMode: 'Card', customerType: 'Bulk Buyer' },
  { date: '2026-10-12', vendorName: 'Fresh Corner', product: 'Milk', category: 'Daily Essentials', quantity: 5, price: 28, paymentMode: 'Cash', customerType: 'Repeat Buyer' },
  { date: '2026-10-13', vendorName: 'Home Essentials', product: 'Bread', category: 'Bakery', quantity: 8, price: 45, paymentMode: 'UPI', customerType: 'Walk-in' },
  { date: '2026-10-13', vendorName: 'Tea Hub', product: 'Banana', category: 'Fruits', quantity: 7, price: 40, paymentMode: 'Cash', customerType: 'Repeat Buyer' },
]

async function seedDatabase() {
  const salesCount = await db.sales.count()
  if (salesCount === 0) {
    await db.sales.bulkAdd(initialSales)
  }

  const inventoryCount = await db.inventory.count()
  if (inventoryCount === 0) {
    await db.inventory.bulkAdd(initialInventory)
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [tab, setTab] = useState('dashboard')
  const [sales, setSales] = useState([])
  const [inventory, setInventory] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    vendorName: '',
    product: 'Rice Bag',
    category: 'Groceries',
    quantity: 1,
    price: 42,
    paymentMode: 'UPI',
    customerType: 'Walk-in',
    notes: '',
  })

  useEffect(() => {
    const loadData = async () => {
      await seedDatabase()
      const savedSales = await db.sales.orderBy('date').reverse().toArray()
      const savedInventory = await db.inventory.orderBy('product').toArray()
      setSales(savedSales)
      setInventory(savedInventory)
    }

    loadData()
  }, [])

  const groupedByDate = useMemo(() => {
    return sales.reduce((acc, sale) => {
      const key = sale.date
      acc[key] = acc[key] || []
      acc[key].push(sale)
      return acc
    }, {})
  }, [sales])

  const dailySales = useMemo(() => {
    const items = groupedByDate[selectedDate] || []
    const revenue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const avgOrder = items.length ? revenue / items.length : 0
    return { items, revenue, totalItems, avgOrder }
  }, [groupedByDate, selectedDate])

  const overview = useMemo(() => {
    const totalRevenue = sales.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const totalTransactions = sales.length
    const topProduct = Object.entries(
      sales.reduce((acc, item) => {
        acc[item.product] = (acc[item.product] || 0) + item.quantity
        return acc
      }, {}),
    ).sort((a, b) => b[1] - a[1])[0]

    return {
      totalRevenue,
      totalTransactions,
      topProduct: topProduct ? `${topProduct[0]} (${topProduct[1]})` : 'No sales',
    }
  }, [sales])

  const chartData = useMemo(() => {
    const labels = []
    const values = []
    const today = new Date()

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      labels.push(date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }))
      values.push((groupedByDate[key] || []).reduce((sum, sale) => sum + sale.quantity * sale.price, 0))
    }

    return {
      labels,
      datasets: [{
        label: 'Daily Revenue',
        data: values,
        backgroundColor: ['#1f8fff', '#53b7ff', '#90cdf4', '#7dd3fc', '#67e8f9', '#5eead4', '#34d399'],
        borderRadius: 10,
      }],
    }
  }, [groupedByDate])

  const salesTrendData = useMemo(() => {
    const labels = []
    const values = []
    const today = new Date()

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      labels.push(date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }))
      values.push((groupedByDate[key] || []).length)
    }

    return {
      labels,
      datasets: [{
        label: 'Transactions per day',
        data: values,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        borderWidth: 2,
        tension: 0.45,
        fill: true,
      }],
    }
  }, [groupedByDate])

  const paymentData = useMemo(() => {
    const paymentMap = sales.reduce((acc, sale) => {
      acc[sale.paymentMode] = (acc[sale.paymentMode] || 0) + sale.quantity * sale.price
      return acc
    }, {})

    return {
      labels: Object.keys(paymentMap),
      datasets: [{
        data: Object.values(paymentMap),
        backgroundColor: ['#1f8fff', '#14b8a6', '#f59e0b', '#a78bfa'],
        borderWidth: 0,
      }],
    }
  }, [sales])

  const categoryData = useMemo(() => {
    const categoryMap = sales.reduce((acc, sale) => {
      acc[sale.category] = (acc[sale.category] || 0) + sale.quantity * sale.price
      return acc
    }, {})

    return {
      labels: Object.keys(categoryMap),
      datasets: [{
        label: 'Category sales',
        data: Object.values(categoryMap),
        backgroundColor: '#1f8fff',
        borderRadius: 12,
      }],
    }
  }, [sales])

  const lowStockItems = inventory.filter((item) => item.stock <= item.reorderLevel)

  const topItems = useMemo(() => {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const currentMonthSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= monthStart && saleDate.getMonth() === new Date().getMonth()
    })

    const map = currentMonthSales.reduce((acc, sale) => {
      const key = sale.product
      if (!acc[key]) {
        acc[key] = { product: key, quantity: 0, revenue: 0, category: sale.category }
      }
      acc[key].quantity += sale.quantity
      acc[key].revenue += sale.quantity * sale.price
      return acc
    }, {})

    const items = Object.values(map).sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    const maxQuantity = items[0]?.quantity || 1

    return items.map((item, index) => ({ ...item, rank: index + 1, width: (item.quantity / maxQuantity) * 100 }))
  }, [sales])

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date()),
    [],
  )

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    if (!loginForm.username || !loginForm.password) {
      setMessage('Enter username and password to continue.')
      return
    }
    setIsAuthenticated(true)
    setMessage('')
  }

  const handleAddSale = async (event) => {
    event.preventDefault()

    if (!formData.vendorName || !formData.product || Number(formData.quantity) <= 0 || Number(formData.price) <= 0) {
      setMessage('Please fill all required fields with valid values.')
      return
    }

    const sale = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      date: formData.date || selectedDate,
    }

    const saleId = await db.sales.add(sale)
    setSales((current) => [{ ...sale, id: saleId }, ...current])
    setMessage('New sale saved successfully.')

    const matchingItem = inventory.find(
      (item) => item.product.toLowerCase() === sale.product.toLowerCase(),
    )

    if (matchingItem) {
      const updatedStock = Math.max(0, matchingItem.stock - sale.quantity)
      await db.inventory.update(matchingItem.id, { stock: updatedStock })
      setInventory((current) =>
        current.map((item) => (item.id === matchingItem.id ? { ...item, stock: updatedStock } : item)),
      )
    } else {
      const newInventoryItem = {
        product: sale.product,
        category: sale.category,
        stock: 0,
        unitPrice: sale.price,
        reorderLevel: 5,
      }

      const inventoryId = await db.inventory.add(newInventoryItem)
      setInventory((current) => [{ ...newInventoryItem, id: inventoryId }, ...current])
    }

    setFormData({
      date: new Date().toISOString().slice(0, 10),
      vendorName: '',
      product: 'Rice Bag',
      category: 'Groceries',
      quantity: 1,
      price: 42,
      paymentMode: 'UPI',
      customerType: 'Walk-in',
      notes: '',
    })
  }

  const exportCSV = () => {
    const rows = [
      ['Date', 'Vendor Name', 'Product', 'Category', 'Quantity', 'Price', 'Payment Mode', 'Customer Type'],
      ...sales.map((sale) => [
        sale.date,
        sale.vendorName,
        sale.product,
        sale.category,
        sale.quantity,
        sale.price,
        sale.paymentMode,
        sale.customerType,
      ]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = 'vendor_daily_sales.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-badge">Vendor Portal</div>
          <h1>VendorVision</h1>
          <p className="login-subtitle">Small business sales and stock management</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Username
              <input type="text" name="username" value={loginForm.username} onChange={handleLoginChange} placeholder="Enter username" />
            </label>
            <label>
              Password
              <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} placeholder="Enter password" />
            </label>
            {message && <p className="login-message">{message}</p>}
            <button type="submit" className="primary-btn full-width-btn">Login to Dashboard</button>
          </form>

          <div className="demo-box">
            <strong>Demo Access</strong>
            <span>Username: vendor</span>
            <span>Password: 1234</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-icon">V</div>
          <div>
            <h2>VendorVision</h2>
            <span>Local business dashboard</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')} type="button">Dashboard</button>
          <button className={tab === 'sales' ? 'active' : ''} onClick={() => setTab('sales')} type="button">Add Sale</button>
          <button className={tab === 'inventory' ? 'active' : ''} onClick={() => setTab('inventory')} type="button">Inventory</button>
          <button className={tab === 'top-items' ? 'active' : ''} onClick={() => setTab('top-items')} type="button">Top Items</button>
          <button className={tab === 'report' ? 'active' : ''} onClick={() => setTab('report')} type="button">Daily Report</button>
        </nav>
      </header>

      <main className="page-content">
        {tab === 'dashboard' && (
          <>
            <section className="hero-panel">
              <div>
                <p className="eyebrow">Business overview</p>
                <h1>Helping small vendors go digital with real-time insight</h1>
                <p className="lead-text">
                  This dashboard helps local sellers track daily sales, stock movement, and payment patterns using a small digital system that is easy to use.
                </p>
              </div>
              <div className="hero-stat-box">
                <span>Today’s revenue</span>
                <strong>{formatCurrency.format(dailySales.revenue || 0)}</strong>
                <small>{dailySales.items.length} transactions recorded</small>
              </div>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <p>Total Revenue</p>
                <strong>{formatCurrency.format(overview.totalRevenue)}</strong>
                <span>Across all recorded sales</span>
              </article>
              <article className="stat-card">
                <p>Transactions</p>
                <strong>{overview.totalTransactions}</strong>
                <span>Daily customer activity</span>
              </article>
              <article className="stat-card">
                <p>Top Product</p>
                <strong>{overview.topProduct}</strong>
                <span>Best seller based on quantity</span>
              </article>
              <article className="stat-card">
                <p>Low Stock Alert</p>
                <strong>{lowStockItems.length}</strong>
                <span>Items need restocking soon</span>
              </article>
            </section>

            <section className="chart-grid">
              <div className="panel-card">
                <div className="section-heading">
                  <h3>Weekly revenue trend</h3>
                </div>
                <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
              </div>

              <div className="panel-card">
                <div className="section-heading">
                  <h3>Payment split</h3>
                </div>
                <Doughnut data={paymentData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </section>

            <section className="chart-grid lower-grid">
              <div className="panel-card">
                <div className="section-heading">
                  <h3>Sales movement</h3>
                </div>
                <Line data={salesTrendData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
              </div>

              <div className="panel-card">
                <div className="section-heading">
                  <h3>Category revenue</h3>
                </div>
                <Bar data={categoryData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
              </div>
            </section>
          </>
        )}

        {tab === 'sales' && (
          <section className="panel-grid">
            <div className="panel-card form-card">
              <div className="section-heading left">
                <p className="eyebrow">Sales entry</p>
                <h3>Add daily vendor sale</h3>
              </div>

              <form className="sale-form" onSubmit={handleAddSale}>
                <label>
                  Date
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </label>
                <label>
                  Vendor Name
                  <input type="text" name="vendorName" value={formData.vendorName} onChange={handleInputChange} placeholder="Example: City Mart" />
                </label>
                <label>
                  Product
                  <input type="text" name="product" value={formData.product} onChange={handleInputChange} placeholder="Example: Rice Bag" />
                </label>
                <label>
                  Category
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>Groceries</option>
                    <option>Daily Essentials</option>
                    <option>Fruits</option>
                    <option>Bakery</option>
                    <option>Beverages</option>
                    <option>Household</option>
                  </select>
                </label>
                <label>
                  Quantity
                  <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} />
                </label>
                <label>
                  Unit Price (₹)
                  <input type="number" min="1" name="price" value={formData.price} onChange={handleInputChange} />
                </label>
                <label>
                  Payment Mode
                  <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange}>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </label>
                <label>
                  Customer Type
                  <select name="customerType" value={formData.customerType} onChange={handleInputChange}>
                    <option>Walk-in</option>
                    <option>Repeat Buyer</option>
                    <option>Bulk Buyer</option>
                  </select>
                </label>
                <label className="full-width">
                  Notes
                  <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="Customer note or sale detail" />
                </label>

                {message && <p className="success-message">{message}</p>}

                <button type="submit" className="primary-btn large-btn">Save Sales Record</button>
              </form>
            </div>

            <div className="panel-card">
              <div className="section-heading left">
                <p className="eyebrow">Recent activity</p>
                <h3>Latest sales</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 8).map((sale) => (
                      <tr key={`${sale.id}-${sale.date}`}>
                        <td>{sale.product}</td>
                        <td>{sale.quantity}</td>
                        <td>{formatCurrency.format(sale.quantity * sale.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tab === 'inventory' && (
          <section className="panel-card full-panel">
            <div className="section-heading left">
              <p className="eyebrow">Inventory status</p>
              <h3>Current stock and reorder alerts</h3>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Unit Price</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const status = item.stock <= item.reorderLevel ? 'Low' : 'Healthy'
                    return (
                      <tr key={item.id} className={status === 'Low' ? 'warning-row' : ''}>
                        <td>{item.product}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>{formatCurrency.format(item.unitPrice)}</td>
                        <td>{item.reorderLevel}</td>
                        <td><span className={`badge ${status === 'Low' ? 'danger' : 'good'}`}>{status}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'top-items' && (
          <section className="panel-card full-panel">
            <div className="section-heading left">
              <p className="eyebrow">Top selling items</p>
              <h3>{monthLabel} sales performance</h3>
            </div>

            <div className="top-items-wrap">
              {topItems.length ? (
                topItems.map((item) => (
                  <div className="top-item-card" key={item.product}>
                    <div className="top-item-header">
                      <div>
                        <span className="rank-badge">#{item.rank}</span>
                        <h4>{item.product}</h4>
                      </div>
                      <strong>{item.quantity} units</strong>
                    </div>

                    <div className="mini-progress">
                      <span style={{ width: `${item.width}%` }} />
                    </div>

                    <div className="top-item-meta">
                      <span>{item.category}</span>
                      <strong>{formatCurrency.format(item.revenue)}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No sales recorded for this month yet.</p>
              )}
            </div>
          </section>
        )}

        {tab === 'report' && (
          <section className="panel-grid">
            <div className="panel-card report-panel">
              <div className="section-heading left">
                <p className="eyebrow">Daily report</p>
                <h3>Business summary for selected date</h3>
              </div>

              <label className="date-picker">
                Select date
                <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </label>

              <div className="report-summary">
                <div>
                  <span>Revenue</span>
                  <strong>{formatCurrency.format(dailySales.revenue || 0)}</strong>
                </div>
                <div>
                  <span>Orders</span>
                  <strong>{dailySales.items.length}</strong>
                </div>
                <div>
                  <span>Items sold</span>
                  <strong>{dailySales.totalItems}</strong>
                </div>
                <div>
                  <span>Average order</span>
                  <strong>{formatCurrency.format(dailySales.avgOrder || 0)}</strong>
                </div>
              </div>

              <div className="report-actions">
                <button type="button" className="secondary-btn" onClick={exportCSV}>Export CSV</button>
                <button type="button" className="primary-btn" onClick={() => window.print()}>Print Report</button>
              </div>
            </div>

            <div className="panel-card">
              <div className="section-heading left">
                <p className="eyebrow">Transactions</p>
                <h3>Detailed record</h3>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dailySales.items.length ? dailySales.items : []).map((sale) => (
                      <tr key={`${sale.id}-${sale.date}`}>
                        <td>{sale.vendorName}</td>
                        <td>{sale.product}</td>
                        <td>{sale.quantity}</td>
                        <td>{formatCurrency.format(sale.quantity * sale.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
