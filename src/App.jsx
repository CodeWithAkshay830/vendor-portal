import { useEffect, useRef, useState } from 'react'
import './App.css'

const navItems = ['Home', 'About', 'Features', 'How It Works', 'Impact', 'Dashboard', 'Contact']
const pagePaths = {
  Home: '/',
  About: '/about',
  Features: '/features',
  'How It Works': '/how-it-works',
  Impact: '/impact',
  Dashboard: '/dashboard',
  Contact: '/contact',
}
const DEMO_USER = { name: 'Ramesh Verma', email: 'vendor@demo.com', password: 'vendor123' }

function getCurrentPage() {
  return Object.entries(pagePaths).find(([, path]) => path === window.location.pathname)?.[0] || 'Home'
}

function getCurrentDashboardTab() {
  const tab = new URLSearchParams(window.location.search).get('tab')
  return dashboardMenu.includes(tab) ? tab : 'Dashboard'
}

const heroStats = [
  { value: '10K+', label: 'Vendors Supported' },
  { value: '80%', label: 'Digital Transactions' },
  { value: '40%', label: 'Increase in Sales' },
  { value: '25+', label: 'Local Markets' },
]

const features = [
  { title: 'Digital Payments', desc: 'Review sample UPI, card and cash transactions in one simple payment tracker.', icon: 'payment', benefit: 'Faster checkout', tab: 'Payments' },
  { title: 'Sales Tracking', desc: 'See daily revenue, order history and your best-selling products at a glance.', icon: 'chart', benefit: 'Know what sells', tab: 'Sales' },
  { title: 'Inventory Control', desc: 'Search your stock, adjust product quantities and spot items that need restocking.', icon: 'box', benefit: 'Avoid stock-outs', tab: 'Inventory' },
  { title: 'Customer Insights', desc: 'Review customer orders and spending to understand who shops with you.', icon: 'users', benefit: 'Build loyalty', tab: 'Customers' },
]

const steps = [
  { number: '01', title: 'Create your shop', text: 'Set up your vendor profile, products and price list in minutes.' },
  { number: '02', title: 'Track every sale', text: 'Record transactions, stock movement and customer activity from one place.' },
  { number: '03', title: 'Grow with insight', text: 'Use analytics to plan pricing, restocking and local demand.' },
]

const impactStats = [
  { value: '₹12.5L', label: 'Monthly sales managed' },
  { value: '3.2x', label: 'Faster order tracking' },
  { value: '92%', label: 'Customer retention' },
  { value: '18 hrs', label: 'Saved every week' },
]

const dashboardMenu = ['Dashboard', 'Products', 'Sales', 'Payments', 'Customers', 'Inventory', 'Insights', 'Markets', 'Messages', 'Settings']
const dashboardIcons = {
  Dashboard: 'home',
  Products: 'box',
  Sales: 'chart',
  Payments: 'payment',
  Customers: 'users',
  Inventory: 'box',
  Insights: 'chart',
  Markets: 'home',
  Messages: 'bell',
  Settings: 'settings',
}

const summaryCards = [
  { label: "Today's Sales", value: '₹1,250', delta: '+18%' },
  { label: 'Total Orders', value: '28', delta: '+12%' },
  { label: 'Customers', value: '46', delta: '+20%' },
  { label: 'Top Product', value: 'Tomato', delta: 'Hot' },
]

const salesRanges = {
  'Last 7 Days': [42, 56, 48, 68, 54, 72, 65],
  'Last 30 Days': [35, 49, 61, 46, 74, 82, 68],
  'This Year': [28, 44, 51, 58, 70, 64, 88],
}

const performance = [
  { name: 'Tomato', value: 120, color: 'red' },
  { name: 'Potato', value: 95, color: 'amber' },
  { name: 'Onion', value: 80, color: 'gold' },
  { name: 'Green Chili', value: 60, color: 'mint' },
  { name: 'Cabbage', value: 45, color: 'sky' },
]

const lineSeries = [
  { name: 'Tomato', color: '#f26d4f', points: '0,90 50,75 95,58 140,66 185,62 230,55 280,42' },
  { name: 'Onion', color: '#5ab7f1', points: '0,86 50,79 95,74 140,69 185,60 230,63 280,58' },
  { name: 'Potato', color: '#72d58f', points: '0,92 50,88 95,81 140,79 185,72 230,70 280,67' },
]

const productRows = [
  { name: 'Tomato', category: 'Vegetables', price: '₹30', stock: '50 kg', emoji: '🍅' },
  { name: 'Potato', category: 'Vegetables', price: '₹25', stock: '120 kg', emoji: '🥔' },
  { name: 'Onion', category: 'Vegetables', price: '₹28', stock: '80 kg', emoji: '🧅' },
  { name: 'Green Chili', category: 'Vegetables', price: '₹40', stock: '20 kg', emoji: '🌶️' },
  { name: 'Cabbage', category: 'Vegetables', price: '₹22', stock: '35 kg', emoji: '🥬' },
]

const sampleCustomers = [
  { name: 'Asha Patel', orders: 18, spent: '₹4,250', status: 'Regular' },
  { name: 'Rahul Shah', orders: 12, spent: '₹2,840', status: 'Regular' },
  { name: 'Meena Joshi', orders: 8, spent: '₹1,920', status: 'New' },
  { name: 'Vikram Singh', orders: 6, spent: '₹1,350', status: 'New' },
]

const samplePayments = [
  { id: 1, customer: 'Asha Patel', method: 'UPI', amount: '₹600', status: 'Received', time: '10:42 AM' },
  { id: 2, customer: 'Rahul Shah', method: 'Cash', amount: '₹350', status: 'Received', time: '10:15 AM' },
  { id: 3, customer: 'Meena Joshi', method: 'Card', amount: '₹480', status: 'Pending', time: '9:38 AM' },
  { id: 4, customer: 'Vikram Singh', method: 'UPI', amount: '₹720', status: 'Received', time: 'Yesterday' },
]

function getStoredUsers() {
  const raw = window.localStorage.getItem('vendorlink-users')
  if (!raw) {
    const seeded = [DEMO_USER]
    window.localStorage.setItem('vendorlink-users', JSON.stringify(seeded))
    return seeded
  }

  try {
    return JSON.parse(raw)
  } catch {
    return [DEMO_USER]
  }
}

function getStoredProducts() {
  const raw = window.localStorage.getItem('vendorlink-products')
  if (!raw) return productRows

  try {
    const savedProducts = JSON.parse(raw)
    return Array.isArray(savedProducts) ? savedProducts : productRows
  } catch {
    return productRows
  }
}

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (name) {
    case 'payment':
      return (
        <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></svg>
      )
    case 'chart':
      return (
        <svg {...common}><path d="M4 18V8" /><path d="M10 18V4" /><path d="M16 18v-7" /><path d="M22 18V10" /></svg>
      )
    case 'box':
      return (
        <svg {...common}><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 7v10l8 4 8-4V7" /><path d="M12 11v10" /></svg>
      )
    case 'users':
      return (
        <svg {...common}><path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><circle cx="10" cy="7" r="3" /><path d="M20 19v-1a4 4 0 0 0-3-3.87" /><path d="M16 3.13a3.5 3.5 0 0 1 0 6.74" /></svg>
      )
    case 'search':
      return (
        <svg {...common}><circle cx="11" cy="11" r="5" /><path d="m16 16 4 4" /></svg>
      )
    case 'bell':
      return (
        <svg {...common}><path d="M15 18H5.5A1.5 1.5 0 0 1 4 16.5v-.2l1.4-2.3V9.5A6.5 6.5 0 0 1 12 3a6.5 6.5 0 0 1 6.5 6.5v4.5L20 16.3v.2a1.5 1.5 0 0 1-1.5 1.5H15" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
      )
    case 'home':
      return (
        <svg {...common}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10.5V20h14v-9.5" /><path d="M9 20v-6h6v6" /></svg>
      )
    case 'plus':
      return (
        <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
      )
    case 'menu':
      return (
        <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      )
    case 'close':
      return (
        <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
      )
    case 'settings':
      return (
        <svg {...common}><circle cx="12" cy="12" r="3.5" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 16l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.8L4.4 6.2A2 2 0 1 1 7.2 3.4l.1.1a1.7 1.7 0 0 0 1.8.3A1.7 1.7 0 0 0 10.1 2.2V2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 6.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.6 1H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z" /></svg>
      )
    default:
      return null
  }
}

function PaymentsPanel() {
  const [filter, setFilter] = useState('All')
  const visiblePayments = filter === 'All'
    ? samplePayments
    : samplePayments.filter((payment) => payment.method === filter)
  const receivedCount = samplePayments.filter((payment) => payment.status === 'Received').length

  return (
    <div className="dashboard-main">
      <div className="dashboard-page-heading"><div><p className="section-kicker">Payment tracking</p><h2>Payments</h2></div><span>Review sample transactions by payment method.</span></div>
      <div className="summary-cards">
        <div className="summary-card"><div className="summary-line"><span>Transactions today</span></div><strong>{samplePayments.length}</strong></div>
        <div className="summary-card"><div className="summary-line"><span>Received</span></div><strong>{receivedCount}</strong></div>
        <div className="summary-card"><div className="summary-line"><span>Pending</span></div><strong>{samplePayments.length - receivedCount}</strong></div>
      </div>
      <div className="payment-filters" aria-label="Filter payments by method">
        {['All', 'UPI', 'Cash', 'Card'].map((method) => (
          <button key={method} type="button" className={filter === method ? 'payment-filter active' : 'payment-filter'} aria-pressed={filter === method} onClick={() => setFilter(method)}>{method}</button>
        ))}
      </div>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead><tr><th>Customer</th><th>Method</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
          <tbody>{visiblePayments.map((payment) => (
            <tr key={payment.id}><td><strong>{payment.customer}</strong></td><td>{payment.method}</td><td>{payment.amount}</td><td><span className={payment.status === 'Pending' ? 'stock-status low' : 'stock-status'}>{payment.status}</span></td><td>{payment.time}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <p className="demo-note payment-demo-note">Demo only: these sample transactions do not process real payments.</p>
    </div>
  )
}

function HomeDashboardPreview({ userName, onOpenTab, onAddProduct }) {
  const sidebarItems = dashboardMenu.slice(0, 7)

  return (
    <section className="dashboard-showcase home-dashboard-preview" aria-label="Dashboard preview">
      <header className="dashboard-topbar">
        <div className="dashboard-brand">VendorLink</div>
        <div className="dashboard-tools">
          <label className="search-box" aria-label="Search dashboard">
            <Icon name="search" />
            <input type="text" placeholder="Search..." />
          </label>
          <button type="button" className="icon-button" aria-label="Notifications">
            <Icon name="bell" />
          </button>
          <div className="profile-pill">
            <div className="profile-avatar">RV</div>
            <div className="profile-copy">
              <strong>{userName}</strong>
              <span>Vegetable Vendor</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          {sidebarItems.map((item, index) => {
            return (
              <button key={item} type="button" className={index === 0 ? 'side-item active' : 'side-item'} onClick={() => onOpenTab(item)}>
                <Icon name={dashboardIcons[item]} />
                <span>{item === 'Markets' ? 'Market Prices' : item}</span>
              </button>
            )
          })}
        </aside>

        <div className="dashboard-main">
          <div className="preview-heading">
            <h2>Dashboard</h2>
            <span>Welcome back, {userName.split(' ')[0]}!</span>
          </div>
          <div className="summary-cards">
            {summaryCards.map((card) => (
              <div key={card.label} className="summary-card">
                <div className="summary-line">
                  <span>{card.label}</span>
                  <small>{card.delta}</small>
                </div>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="analytics-grid">
            <div className="panel-box">
              <div className="panel-head">
                <h3>Sales Overview</h3>
                <button type="button" className="mini-chip">Last 7 Days</button>
              </div>
              <svg viewBox="0 0 300 130" className="trend-svg" preserveAspectRatio="none" role="img" aria-label="Sales overview chart">
                <polyline points="0,105 35,94 72,99 108,72 145,55 180,68 215,50 250,58 300,27" fill="none" stroke="#16a66a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="0,105 35,94 72,99 108,72 145,55 180,68 215,50 250,58 300,27 300,130 0,130" fill="rgba(30,167,122,.14)" stroke="none" />
              </svg>
            </div>
            <div className="panel-box">
              <div className="panel-head"><h3>Product Performance</h3></div>
              <div className="performance-list">
                {performance.slice(0, 4).map((product) => (
                  <div key={product.name} className="performance-row">
                    <span className={`legend-dot ${product.color}`} />
                    <span className="perf-name">{product.name}</span>
                    <div className="perf-track">
                      <span className={`perf-fill ${product.color}`} style={{ width: `${product.value}%` }} />
                    </div>
                    <strong>{product.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="analytics-grid lower-grid">
            <div className="panel-box">
              <div className="panel-head">
                <h3>Market Price Trend</h3>
                <button type="button" className="mini-chip">This Week</button>
              </div>
              <svg viewBox="0 0 300 100" className="trend-svg" preserveAspectRatio="none" role="img" aria-label="Market price trends for vegetables">
                {lineSeries.map((line) => (
                  <polyline key={line.name} points={line.points} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                ))}
              </svg>
              <div className="legend-row">
                {lineSeries.map((line) => (
                  <span key={line.name}><i style={{ background: line.color }} />{line.name}</span>
                ))}
              </div>
            </div>
            <div className="panel-box">
              <div className="panel-head"><h3>Quick Actions</h3></div>
              <div className="action-grid">
                <button type="button" className="action-btn add" onClick={onAddProduct}><Icon name="plus" /><span>Add Product</span></button>
                <button type="button" className="action-btn" onClick={() => onOpenTab('Insights')}><Icon name="chart" /><span>View Reports</span></button>
                <button type="button" className="action-btn" onClick={() => onOpenTab('Customers')}><Icon name="users" /><span>Customers</span></button>
                <button type="button" className="action-btn" onClick={() => onOpenTab('Markets')}><Icon name="chart" /><span>Market Prices</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeProductsPreview({ products, onOpenTab, onAddProduct, onEditProduct, onDeleteProduct }) {
  return (
    <section className="dashboard-showcase home-products-preview" aria-label="Products preview">
      <header className="dashboard-topbar">
        <div className="dashboard-brand">VendorLink</div>
        <button type="button" className="btn btn-primary product-add-button" onClick={onAddProduct}><Icon name="plus" /> Add Product</button>
      </header>
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          {dashboardMenu.slice(0, 7).map((item, index) => {
            return (
              <button key={item} type="button" className={index === 1 ? 'side-item active' : 'side-item'} onClick={() => onOpenTab(item)}>
                <Icon name={dashboardIcons[item]} />
                <span>{item === 'Markets' ? 'Market Prices' : item}</span>
              </button>
            )
          })}
        </aside>
        <div className="products-preview-content">
          <div className="preview-heading">
            <h2>Products</h2>
            <span>Manage your products and inventory</span>
          </div>
          <div className="product-preview-table" role="table" aria-label="Product inventory">
            <div className="product-preview-row product-preview-head" role="row">
              <span>Product</span><span>Category</span><span>Price (₹)</span><span>Stock</span><span>Actions</span>
            </div>
            {products.map((product) => (
              <div key={product.name} className="product-preview-row" role="row">
                <strong><span className="product-emoji">{product.emoji}</span>{product.name}</strong>
                <span>{product.category}</span>
                <span>{product.price.replace('₹', '')}</span>
                <span>{product.stock}</span>
                <span className="product-row-actions"><button type="button" onClick={() => onEditProduct(product)}>Edit</button><button type="button" onClick={() => onDeleteProduct(product.name)}>Delete</button></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardProductsPanel({
  products,
  query,
  onQueryChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isFormOpen,
  editingProduct,
  productForm,
  productFormMessage,
  onProductFormChange,
  onProductSubmit,
  onCancelProductForm,
  inventoryOnly = false,
}) {
  const title = inventoryOnly ? 'Inventory' : 'Products'
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="dashboard-main">
      <div className="dashboard-page-heading">
        <div>
          <p className="section-kicker">{inventoryOnly ? 'Stock control' : 'Product catalogue'}</p>
          <h2>{title}</h2>
        </div>
        <span>{inventoryOnly ? 'Monitor stock and restock in time.' : 'Manage prices and product availability.'}</span>
      </div>
      <div className="product-controls">
        <label className="search-box">
          <Icon name="search" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </label>
        {!inventoryOnly && (
          <button type="button" className="btn btn-primary" onClick={onAddProduct}>
            <Icon name="plus" /> Add Product
          </button>
        )}
      </div>
        {isFormOpen && (
          <form className="product-editor panel-box" onSubmit={onProductSubmit}>
            <div className="panel-head"><h3>{editingProduct ? 'Edit product' : 'Add a product'}</h3></div>
            <div className="product-editor-fields">
              <label>Product name<input name="name" value={productForm.name} onChange={onProductFormChange} placeholder="e.g. Fresh peas" required /></label>
              <label>Category<input name="category" value={productForm.category} onChange={onProductFormChange} placeholder="Vegetables" required /></label>
              <label>Price (₹)<input name="price" type="number" min="0" step="0.01" value={productForm.price} onChange={onProductFormChange} placeholder="30" required /></label>
              <label>Stock (kg)<input name="stock" type="number" min="0" step="0.1" value={productForm.stock} onChange={onProductFormChange} placeholder="25" required /></label>
            </div>
            {productFormMessage && <p className="auth-message">{productFormMessage}</p>}
            <div className="product-editor-actions">
              <button type="button" className="btn btn-ghost" onClick={onCancelProductForm}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingProduct ? 'Save changes' : 'Add product'}</button>
            </div>
          </form>
        )}
        <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              {inventoryOnly ? <><th>Stock status</th><th>Action</th></> : <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const lowStock = Number.parseInt(product.stock, 10) < 25
              return (
                <tr key={product.name}>
                  <td><strong className="table-product-name"><span>{product.emoji || '📦'}</span>{product.name}</strong></td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  {inventoryOnly ? (
                    <>
                      <td><span className={lowStock ? 'stock-status low' : 'stock-status'}>{lowStock ? 'Low stock' : 'In stock'}</span></td>
                      <td className="table-actions"><button type="button" onClick={() => onEditProduct(product)}>Edit stock</button></td>
                    </>
                  ) : (
                    <td className="table-actions">
                      <button type="button" onClick={() => onEditProduct(product)}>Edit</button>
                      <button type="button" className="delete-action" onClick={() => onDeleteProduct(product.name)}>Delete</button>
                    </td>
                  )}
                </tr>
              )
            })}
            {filteredProducts.length === 0 && (
              <tr><td colSpan={inventoryOnly ? 6 : 5} className="empty-products">No matching products. Try another search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DashboardTabContent({ activeTab, products, readMessages, setReadMessages, settings, setSettings }) {
  if (activeTab === 'Payments') return <PaymentsPanel />

  if (activeTab === 'Sales') {
    return (
      <div className="dashboard-main">
        <div className="dashboard-page-heading"><div><p className="section-kicker">Performance</p><h2>Sales</h2></div><span>Track orders and daily revenue.</span></div>
        <div className="summary-cards">
          {summaryCards.slice(0, 3).map((card) => <div key={card.label} className="summary-card"><div className="summary-line"><span>{card.label}</span><small>{card.delta}</small></div><strong>{card.value}</strong></div>)}
        </div>
        <div className="panel-box">
          <div className="panel-head"><h3>Sales by day</h3><span className="mini-chip">This week</span></div>
          <div className="sales-bars">
            {[42, 56, 48, 68, 54, 82, 72].map((value, index) => <div key={index} className="sales-bar-column"><span className="sales-bar" style={{ height: `${value}%` }} /><label>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</label></div>)}
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'Customers') {
    return (
      <div className="dashboard-main">
        <div className="dashboard-page-heading"><div><p className="section-kicker">Relationships</p><h2>Customers</h2></div><span>See who is shopping with you.</span></div>
        <div className="summary-cards">
          <div className="summary-card"><div className="summary-line"><span>Total customers</span></div><strong>46</strong></div>
          <div className="summary-card"><div className="summary-line"><span>Returning customers</span></div><strong>32</strong></div>
          <div className="summary-card"><div className="summary-line"><span>Average order</span></div><strong>₹285</strong></div>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead><tr><th>Customer</th><th>Orders</th><th>Total spent</th><th>Type</th></tr></thead>
            <tbody>{sampleCustomers.map((customer) => <tr key={customer.name}><td><strong>{customer.name}</strong></td><td>{customer.orders}</td><td>{customer.spent}</td><td><span className="stock-status">{customer.status}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    )
  }

  if (activeTab === 'Insights') {
    return (
      <div className="dashboard-main">
        <div className="dashboard-page-heading"><div><p className="section-kicker">Business growth</p><h2>Insights</h2></div><span>Simple signals to help you plan the next step.</span></div>
        <div className="impact-grid">{impactStats.map((item) => <div key={item.label} className="impact-card"><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
        <div className="panel-box insight-callout"><span className="feature-icon"><Icon name="chart" /></span><div><h3>Tomato is your top seller this week</h3><p>Keep an eye on stock before the weekend market rush. Your sales are trending up compared with last week.</p></div></div>
      </div>
    )
  }

  if (activeTab === 'Markets') {
    return (
      <div className="dashboard-main">
        <div className="dashboard-page-heading"><div><p className="section-kicker">Local market</p><h2>Market Prices</h2></div><span>Compare your products with current sample market rates.</span></div>
        <div className="panel-box">
          <div className="panel-head"><h3>Weekly price movement</h3><span className="mini-chip">This week</span></div>
          <svg viewBox="0 0 600 170" className="trend-svg market-chart" preserveAspectRatio="none" role="img" aria-label="Weekly market price movement">{lineSeries.map((line) => <polyline key={line.name} points={line.points} fill="none" stroke={line.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}</svg>
          <div className="legend-row">{lineSeries.map((line) => <span key={line.name}><i style={{ background: line.color }} />{line.name}</span>)}</div>
        </div>
        <div className="summary-cards">{products.slice(0, 4).map((product) => <div key={product.name} className="summary-card"><div className="summary-line"><span>{product.name}</span></div><strong>{product.price}</strong></div>)}</div>
      </div>
    )
  }

  if (activeTab === 'Messages') {
    const messages = [
      { id: 1, name: 'Asha Patel', text: 'Can you keep 2 kg tomatoes for me?', time: '10:42 AM' },
      { id: 2, name: 'Rahul Shah', text: 'Do you have fresh green chillies today?', time: 'Yesterday' },
      { id: 3, name: 'Meena Joshi', text: 'Thank you for the quick delivery!', time: 'Yesterday' },
    ]
    return (
      <div className="dashboard-main">
        <div className="dashboard-page-heading"><div><p className="section-kicker">Customer inbox</p><h2>Messages</h2></div><span>Keep customer conversations in one place.</span></div>
        <div className="message-list">{messages.map((item) => <article key={item.id} className={readMessages.includes(item.id) ? 'message-card read' : 'message-card'}><div className="message-avatar">{item.name.split(' ').map((part) => part[0]).join('')}</div><div className="message-copy"><strong>{item.name}</strong><p>{item.text}</p></div><span className="message-time">{item.time}</span><button type="button" onClick={() => setReadMessages((current) => current.includes(item.id) ? current : [...current, item.id])}>{readMessages.includes(item.id) ? 'Read' : 'Mark read'}</button></article>)}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-main">
      <div className="dashboard-page-heading"><div><p className="section-kicker">Preferences</p><h2>Settings</h2></div><span>Choose which updates you want to receive.</span></div>
      <div className="settings-list">
        {[['lowStock', 'Low-stock alerts', 'Get notified when a product is running low.'], ['dailySummary', 'Daily sales summary', 'Receive a short summary of your daily sales.'], ['customerMessages', 'Customer messages', 'Get notified when a customer sends a message.']].map(([key, title, description]) => (
          <label key={key} className="setting-row"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={settings[key]} onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.checked }))} /></label>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage)
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('vendorlink-theme')
    return savedTheme || 'light'
  })

  const [authState, setAuthState] = useState(() => {
    const saved = window.localStorage.getItem('vendorlink-auth')
    if (!saved) {
      return { isAuthenticated: false, user: null }
    }

    try {
      return JSON.parse(saved)
    } catch {
      return { isAuthenticated: false, user: null }
    }
  })

  const [showAuth, setShowAuth] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [activeDashboardTab, setActiveDashboardTab] = useState(getCurrentDashboardTab)
  const [dashboardSearch, setDashboardSearch] = useState('')
  const [salesRange, setSalesRange] = useState('Last 7 Days')
  const [readMessages, setReadMessages] = useState([])
  const [dashboardSettings, setDashboardSettings] = useState({ lowStock: true, dailySummary: true, customerMessages: false })
  const [products, setProducts] = useState(getStoredProducts)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState('')
  const [productForm, setProductForm] = useState({ name: '', category: 'Vegetables', price: '', stock: '' })
  const [productFormMessage, setProductFormMessage] = useState('')
  const [contactForm, setContactForm] = useState({ name: '', email: '', mobile: '', message: '' })
  const contactFormRef = useRef(null)

  useEffect(() => {
    document.body.dataset.theme = theme
    window.localStorage.setItem('vendorlink-theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('vendorlink-auth', JSON.stringify(authState))
  }, [authState])

  useEffect(() => {
    window.localStorage.setItem('vendorlink-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    const syncPage = () => {
      setCurrentPage(getCurrentPage())
      setActiveDashboardTab(getCurrentDashboardTab())
    }
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])

  const navigateToPage = (event, page) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const path = pagePaths[page]
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setCurrentPage(page)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleAuthInput = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleAuthSubmit = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()
    const fullName = form.name.trim()

    if (!email || !password || (authMode === 'signup' && !fullName)) {
      setMessage('Please fill in all the required fields.')
      return
    }

    const users = getStoredUsers()

    if (authMode === 'signup') {
      const alreadyExists = users.some((user) => user.email.toLowerCase() === email)
      if (alreadyExists) {
        setMessage('This email is already registered. Please login instead.')
        return
      }

      const newUser = { name: fullName, email, password }
      users.push(newUser)
      window.localStorage.setItem('vendorlink-users', JSON.stringify(users))
      setAuthState({ isAuthenticated: true, user: newUser })
      setForm({ name: '', email: '', password: '' })
      setMessage('')
      setShowAuth(false)
      return
    }

    const matchingUser = users.find(
      (user) => user.email.toLowerCase() === email && user.password === password,
    )

    if (!matchingUser) {
      const demoUser = DEMO_USER.email === email && DEMO_USER.password === password
      if (!demoUser) {
        setMessage('Invalid email or password. Try vendor@demo.com / vendor123')
        return
      }
    }

    const user = matchingUser || DEMO_USER
    setAuthState({ isAuthenticated: true, user })
    setForm({ name: '', email: '', password: '' })
    setMessage('')
    setShowAuth(false)
  }

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null })
    setShowAuth(false)
  }

  const openProductForm = (product) => {
    if (product) {
      setEditingProduct(product.name)
      setProductForm({
        name: product.name,
        category: product.category,
        price: product.price.replace(/[^\d.]/g, ''),
        stock: product.stock.replace(/[^\d.]/g, ''),
      })
    } else {
      setEditingProduct('')
      setProductForm({ name: '', category: 'Vegetables', price: '', stock: '' })
    }
    setProductFormMessage('')
    setIsProductFormOpen(true)
  }

  const handleProductFormChange = (event) => {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()
    const productName = productForm.name.trim()
    const duplicate = products.some((product) =>
      product.name.toLowerCase() === productName.toLowerCase() && product.name !== editingProduct,
    )

    if (duplicate) {
      setProductFormMessage('A product with this name already exists.')
      return
    }

    const nextProduct = {
      name: productName,
      category: productForm.category.trim(),
      price: `₹${productForm.price}`,
      stock: `${productForm.stock} kg`,
      emoji: editingProduct ? products.find((product) => product.name === editingProduct)?.emoji : '📦',
    }

    setProducts((current) => editingProduct
      ? current.map((product) => product.name === editingProduct ? nextProduct : product)
      : [...current, nextProduct])
    setIsProductFormOpen(false)
    setEditingProduct('')
    setProductFormMessage('')
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()
    const subject = `VendorLink enquiry from ${contactForm.name.trim()}`
    const body = [
      `Name: ${contactForm.name.trim()}`,
      `Email: ${contactForm.email.trim()}`,
      `Mobile number: ${contactForm.mobile.trim()}`,
      '',
      contactForm.message.trim(),
    ].join('\n')
    window.location.href = `mailto:hello@vendorlink.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleBookDemo = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    contactFormRef.current?.querySelector('input')?.focus({ preventScroll: true })
  }

  const handleDeleteProduct = (productName) => {
    setProducts((current) => current.filter((product) => product.name !== productName))
  }

  const openDashboardTab = (tab) => {
    const dashboardPath = `${pagePaths.Dashboard}?tab=${encodeURIComponent(tab)}`
    if (window.location.pathname !== pagePaths.Dashboard || window.location.search !== `?tab=${encodeURIComponent(tab)}`) {
      window.history.pushState({}, '', dashboardPath)
    }
    setCurrentPage('Dashboard')
    setActiveDashboardTab(tab)
    setDashboardSearch('')
    setIsProductFormOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const userName = authState.user?.name || 'Vendor'
  const salesLabels = {
    'Last 7 Days': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    'Last 30 Days': ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    'This Year': ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'],
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="brand">VendorLink</div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
        </button>

        <div className={mobileMenuOpen ? 'site-menu mobile-open' : 'site-menu'}>
          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={pagePaths[item]}
                className={currentPage === item ? 'nav-link active' : 'nav-link'}
                aria-current={currentPage === item ? 'page' : undefined}
                onClick={(event) => navigateToPage(event, item)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle light and dark theme"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {authState.isAuthenticated ? (
              <>
                <button type="button" className="user-pill">Hi, {userName.split(' ')[0]}</button>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-ghost" onClick={() => { setAuthMode('login'); setShowAuth(true); setMobileMenuOpen(false) }}>Login</button>
                <button type="button" className="btn btn-primary" onClick={() => { setAuthMode('signup'); setShowAuth(true); setMobileMenuOpen(false) }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {currentPage === 'Home' && (
          <div className="home-reference-layout">
            <div className="home-left-column">
              <section className="hero-section home-hero">
                <div className="hero-copy">
                  <p className="eyebrow">Empowering</p>
                  <h1>
                    Small Vendors<br />
                    Go <span>Digital with Data</span>
                  </h1>
                  <p className="lead">
                    A simple platform to help local vendors manage sales, track data,
                    understand customers and grow their business digitally.
                  </p>
                  {!authState.isAuthenticated && (
                    <div className="cta-row">
                      <button type="button" className="btn btn-primary large" onClick={() => { setAuthMode('signup'); setShowAuth(true) }}>Get Started</button>
                      <button type="button" className="btn btn-secondary large">▶ Watch Video</button>
                    </div>
                  )}
                </div>
                <div className="sales-badge">
                  <span className="mini-ring"><Icon name="chart" /></span>
                  <div>
                    <span>Today&apos;s Sales</span>
                    <strong>₹1,250</strong>
                    <em>+18%</em>
                  </div>
                </div>
              </section>

              <div className="hero-stats">
                {heroStats.map((stat, index) => (
                  <div key={stat.label} className="hero-stat-card">
                    <div className="stat-bullet"><Icon name={['users', 'payment', 'chart', 'home'][index]} /></div>
                    <div>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <section className="home-features">
                <p className="section-kicker">Features</p>
                <h2>Everything a Vendor Needs,<br />in One <span>Simple Platform</span></h2>
                <p className="home-section-intro">We use data and technology to make traditional businesses smarter, simpler and more profitable.</p>
                <div className="feature-grid">
                  {features.map((feature) => (
                    <article key={feature.title} className="feature-card">
                      <div className="feature-icon"><Icon name={feature.icon} /></div>
                      <h3>{feature.title}</h3>
                      <p>{feature.desc}</p>
                      <span className="feature-benefit">{feature.benefit}</span>
                      <a className="feature-open-button" href={`${pagePaths.Dashboard}?tab=${encodeURIComponent(feature.tab)}`}>Open feature <span aria-hidden="true">→</span></a>
                    </article>
                  ))}
                </div>
              </section>

              <section className="home-mission">
                <div className="home-mission-photo" role="img" aria-label="Local market vendor serving customers" />
                <div className="home-mission-copy">
                  <p className="section-kicker">Our Mission</p>
                  <h2>Bridging the Gap Between <span>Local Vendors and the Digital World</span></h2>
                  <p>Small vendors are the backbone of our communities. Our mission is to give them simple digital tools and data-driven insights so they can compete, grow and build a better future.</p>
                  <a href={pagePaths.About} className="btn btn-primary" onClick={(event) => navigateToPage(event, 'About')}>Learn More</a>
                </div>
              </section>
            </div>

            <aside className="home-right-column">
              <HomeDashboardPreview
                userName={authState.user?.name || 'Ramesh Verma'}
                onOpenTab={openDashboardTab}
                onAddProduct={() => { openDashboardTab('Products'); openProductForm() }}
              />
              <HomeProductsPreview
                products={products}
                onOpenTab={openDashboardTab}
                onAddProduct={() => { openDashboardTab('Products'); openProductForm() }}
                onEditProduct={(product) => {
                  openDashboardTab('Products')
                  if (product) openProductForm(product)
                }}
                onDeleteProduct={handleDeleteProduct}
              />
            </aside>
          </div>
        )}

        {currentPage === 'About' && <section className="story-section">
          <div className="story-photo" aria-label="Market vegetables" />
          <div className="story-copy">
            <p className="section-kicker">About</p>
            <h2>Built to support local markets and small business growth.</h2>
            <p>
              Most vendors still work with notebooks, manual billing and scattered stock records.
              VendorLink centralizes sales, inventory and customer insights so small businesses can
              move online without complexity.
            </p>
            <ul>
              <li>Daily sales visibility</li>
              <li>Faster payment collection</li>
              <li>Smarter stock management</li>
            </ul>
          </div>
        </section>}

        {currentPage === 'Features' && <section className="content-section features-page-section">
          <div className="features-page-intro">
            <div>
              <p className="section-kicker">Made for your everyday market</p>
              <h2>Everything a vendor needs, in one simple system</h2>
              <p>Spend less time managing notes and more time serving customers. VendorLink brings your everyday shop tools together in one clear workspace.</p>
            </div>
            <div className="feature-intro-badge"><span>✦</span><strong>Simple by design</strong><small>Easy to use, even on busy market days</small></div>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card feature-page-card">
                <div className="feature-icon"><Icon name={feature.icon} /></div>
                <span className="feature-card-label">Vendor tools</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="feature-benefit"><span>✓</span>{feature.benefit}</div>
                <a className="feature-open-button" href={`${pagePaths.Dashboard}?tab=${encodeURIComponent(feature.tab)}`}>Open {feature.title.toLowerCase()} <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
          <div className="feature-page-footer">
            <p><strong>One place. A smoother business day.</strong><span>See your products, sales and customers together in your dashboard.</span></p>
            <a href={pagePaths.Dashboard} className="btn btn-primary" onClick={(event) => navigateToPage(event, 'Dashboard')}>Explore dashboard <span aria-hidden="true">→</span></a>
          </div>
        </section>}

        {currentPage === 'How It Works' && <section className="content-section">
          <p className="section-kicker">How it works</p>
          <h2>Simple steps for smarter selling</h2>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>}

        {currentPage === 'Impact' && <section className="content-section impact-section">
          <p className="section-kicker">Impact</p>
          <h2>Digital adoption that improves daily business performance</h2>
          <div className="impact-grid">
            {impactStats.map((item) => (
              <div key={item.label} className="impact-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>}

        {currentPage === 'Dashboard' && <section className="dashboard-showcase">
          <header className="dashboard-topbar">
            <div className="dashboard-brand">VendorLink</div>
            <div className="dashboard-tools">
              <label className="search-box" aria-label="Search">
                <Icon name="search" />
                <input
                  type="search"
                  value={dashboardSearch}
                  onChange={(event) => setDashboardSearch(event.target.value)}
                  placeholder="Search products..."
                />
              </label>
              <button type="button" className="icon-button" aria-label="Open messages" onClick={() => setActiveDashboardTab('Messages')}>
                <Icon name="bell" />
              </button>
              <div className="profile-pill">
                <div className="profile-avatar">RV</div>
                <div className="profile-copy">
                  <strong>{authState.user?.name || 'Ramesh Verma'}</strong>
                  <span>Vegetable Vendor</span>
                </div>
              </div>
            </div>
          </header>

          <div className="dashboard-body">
            <aside className="dashboard-sidebar">
              {dashboardMenu.map((item) => {
                return (
                  <button
                    key={item}
                    type="button"
                    className={activeDashboardTab === item ? 'side-item active' : 'side-item'}
                    aria-current={activeDashboardTab === item ? 'page' : undefined}
                    onClick={() => {
                      setActiveDashboardTab(item)
                      setDashboardSearch('')
                      setIsProductFormOpen(false)
                    }}
                  >
                    <Icon name={dashboardIcons[item]} />
                    <span>{item}</span>
                  </button>
                )
              })}
            </aside>

            {activeDashboardTab === 'Dashboard' && <div className="dashboard-main">
              <div className="dashboard-page-heading">
                <div><p className="section-kicker">Overview</p><h2>Dashboard</h2></div>
                <span>Welcome back, {authState.user?.name?.split(' ')[0] || 'Ramesh'}!</span>
              </div>
              <div className="summary-cards">
                {summaryCards.map((card) => (
                  <div key={card.label} className="summary-card">
                    <div className="summary-line">
                      <span>{card.label}</span>
                      <small>{card.delta}</small>
                    </div>
                    <strong>{card.value}</strong>
                  </div>
                ))}
              </div>

              <div className="analytics-grid">
                <div className="panel-box">
                  <div className="panel-head">
                    <h3>Sales Overview</h3>
                    <select className="mini-chip" value={salesRange} onChange={(event) => setSalesRange(event.target.value)} aria-label="Sales chart period">
                      {Object.keys(salesRanges).map((range) => <option key={range}>{range}</option>)}
                    </select>
                  </div>
                  <div className="sales-bars">
                    {salesRanges[salesRange].map((value, index) => (
                      <div key={index} className="sales-bar-column">
                        <span className="sales-bar" style={{ height: `${value}%` }} />
                        <label>{salesLabels[salesRange][index]}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel-box">
                  <div className="panel-head">
                    <h3>Product Performance</h3>
                  </div>
                  <div className="performance-list">
                    {performance.map((product) => (
                      <div key={product.name} className="performance-row">
                        <span className={`legend-dot ${product.color}`} />
                        <span className="perf-name">{product.name}</span>
                        <div className="perf-track">
                          <span className={`perf-fill ${product.color}`} style={{ width: `${product.value}%` }} />
                        </div>
                        <strong>{product.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analytics-grid lower-grid">
                <div className="panel-box">
                  <div className="panel-head">
                    <h3>Market Price Trend</h3>
                    <button type="button" className="mini-chip">This Week</button>
                  </div>
                  <div className="line-graph-wrap">
                    <svg viewBox="0 0 300 130" className="trend-svg" preserveAspectRatio="none" role="img" aria-label="Market price trend chart">
                      {lineSeries.map((line) => (
                        <polyline key={line.name} points={line.points} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      ))}
                    </svg>
                    <div className="legend-row">
                      {lineSeries.map((line) => (
                        <span key={line.name}><i style={{ background: line.color }} />{line.name}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="panel-box">
                  <div className="panel-head">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="action-grid">
                    <button type="button" className="action-btn add" onClick={() => { setActiveDashboardTab('Products'); openProductForm() }}><Icon name="plus" /><span>Add Product</span></button>
                    <button type="button" className="action-btn" onClick={() => setActiveDashboardTab('Insights')}><Icon name="chart" /><span>View Report</span></button>
                    <button type="button" className="action-btn" onClick={() => setActiveDashboardTab('Messages')}><Icon name="users" /><span>Messages</span></button>
                    <button type="button" className="action-btn" onClick={() => setActiveDashboardTab('Markets')}><Icon name="chart" /><span>Market Prices</span></button>
                  </div>
                </div>
              </div>
            </div>}
            {activeDashboardTab === 'Products' && (
              <DashboardProductsPanel
                products={products}
                query={dashboardSearch}
                onQueryChange={setDashboardSearch}
                onAddProduct={() => openProductForm()}
                onEditProduct={(product) => openProductForm(product)}
                onDeleteProduct={handleDeleteProduct}
                isFormOpen={isProductFormOpen}
                editingProduct={editingProduct}
                productForm={productForm}
                productFormMessage={productFormMessage}
                onProductFormChange={handleProductFormChange}
                onProductSubmit={handleProductSubmit}
                onCancelProductForm={() => setIsProductFormOpen(false)}
              />
            )}
            {activeDashboardTab === 'Inventory' && (
              <DashboardProductsPanel
                products={products}
                query={dashboardSearch}
                onQueryChange={setDashboardSearch}
                onEditProduct={(product) => openProductForm(product)}
                isFormOpen={isProductFormOpen}
                editingProduct={editingProduct}
                productForm={productForm}
                productFormMessage={productFormMessage}
                onProductFormChange={handleProductFormChange}
                onProductSubmit={handleProductSubmit}
                onCancelProductForm={() => setIsProductFormOpen(false)}
                inventoryOnly
              />
            )}
            {!['Dashboard', 'Products', 'Inventory'].includes(activeDashboardTab) && (
              <DashboardTabContent
                activeTab={activeDashboardTab}
                products={products}
                readMessages={readMessages}
                setReadMessages={setReadMessages}
                settings={dashboardSettings}
                setSettings={setDashboardSettings}
              />
            )}
          </div>
        </section>}

        {currentPage === 'Contact' && <section className="contact-section">
          <div className="contact-card">
            <div className="contact-copy">
              <p className="section-kicker">Contact</p>
              <h2>Let's build smarter local commerce together.</h2>
              <p>
                A student project focused on helping vendors adopt digital tools, improve decision making,
                and become more efficient in a modern market.
              </p>
              <div className="contact-actions">
                <a href="mailto:hello@vendorlink.in">Email: hello@vendorlink.in</a>
                <button type="button" className="btn btn-primary" onClick={handleBookDemo}>Book a Demo</button>
              </div>
            </div>
            <form id="contact-form" ref={contactFormRef} className="contact-form" onSubmit={handleContactSubmit}>
              <h3>Send us a message</h3>
              <label>
                Your name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={contactForm.name}
                  onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={contactForm.email}
                  onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Mobile number
                <input
                  type="tel"
                  name="mobile"
                  autoComplete="tel"
                  inputMode="tel"
                  value={contactForm.mobile}
                  onChange={(event) => setContactForm((current) => ({ ...current, mobile: event.target.value }))}
                  placeholder="+91 98765 43210"
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Tell us how we can help"
                  rows="4"
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary">Send</button>
              <p className="contact-form-note">This demo opens your email app with the message filled in; it does not send or store messages on a server.</p>
            </form>
          </div>
        </section>}
      </main>

      <footer className="site-footer">
        <span>© 2026 VendorLink</span>
        <span>Empowering local commerce</span>
      </footer>

      {showAuth && (
        <div className="auth-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
            <div className="auth-header">
              <div>
                <p className="section-kicker">Access portal</p>
                <h3>{authMode === 'login' ? 'Login to your account' : 'Create a new account'}</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowAuth(false)}>×</button>
            </div>

            <div className="auth-tabs">
              <button type="button" className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => setAuthMode('login')}>Login</button>
              <button type="button" className={authMode === 'signup' ? 'auth-tab active' : 'auth-tab'} onClick={() => setAuthMode('signup')}>Sign Up</button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <label>
                  Full name
                  <input type="text" name="name" value={form.name} onChange={handleAuthInput} placeholder="Your name" />
                </label>
              )}

              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleAuthInput} placeholder="vendor@example.com" />
              </label>

              <label>
                Password
                <input type="password" name="password" value={form.password} onChange={handleAuthInput} placeholder="Enter your password" />
              </label>

              {message && <p className="auth-message">{message}</p>}

              <button type="submit" className="btn btn-primary full-width">
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>

            <p className="demo-note">
              Demo login: <strong>vendor@demo.com</strong> / <strong>vendor123</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
