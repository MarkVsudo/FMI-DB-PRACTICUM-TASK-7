import { useState } from "react";
import Products from "./pages/Products";
import Manufacturers from "./pages/Manufacturers";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import "./App.css";

const TABS = [
  { id: "Products", label: "🍫 Products" },
  { id: "Manufacturers", label: "🏭 Manufacturers" },
  { id: "Categories", label: "🗂 Categories" },
  { id: "Customers", label: "👥 Customers" },
  { id: "Orders", label: "📦 Orders" },
];

const PAGES = { Products, Manufacturers, Categories, Customers, Orders };

export default function App() {
  const [tab, setTab] = useState("Products");
  const Page = PAGES[tab];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="brand-icon">🍫</span>
          <span className="brand-name">ChocoStore</span>
        </div>
        <nav className="sidebar__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">Admin Panel</div>
      </aside>
      <main className="content">
        <Page />
      </main>
    </div>
  );
}
