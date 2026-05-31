import { useState, useEffect } from "react";
import {
  getProducts,
  getManufacturers,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api";

const EMPTY = {
  name: "",
  description: "",
  grammage: "",
  price: "",
  quantity: "",
  manname: "",
  catno: "",
};

const CATEGORY_COLORS = {
  "Dark Chocolate": { bg: "#2a1a0e", text: "#d4a96a" },
  "Milk Chocolate": { bg: "#2e1d10", text: "#e8c08a" },
  "White Chocolate": { bg: "#2a2010", text: "#f0d9a0" },
  Pralines: { bg: "#1e1a2e", text: "#c4a8e0" },
};

// ✅ Извън компонента
function Field({ label, name, type = "text", value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [mfrs, setMfrs] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    try {
      const [p, m, c] = await Promise.all([
        getProducts(),
        getManufacturers(),
        getCategories(),
      ]);
      setProducts(p);
      setMfrs(m);
      setCats(c);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [p, m, c] = await Promise.all([
          getProducts(),
          getManufacturers(),
          getCategories(),
        ]);
        if (!active) return;
        setProducts(p);
        setMfrs(m);
        setCats(c);
      } catch (e) {
        if (!active) return;
        setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  function handleFieldChange(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function openAdd() {
    setForm(EMPTY);
    setModal("add");
  }

  function openEdit(p) {
    setForm({
      name: p.NAME,
      description: p.DESCRIPTION,
      grammage: p.GRAMMAGE,
      price: p.PRICE,
      quantity: p.QUANTITY,
      manname: p.MANNAME,
      catno: p.CATNO ?? "",
    });
    setModal(p);
  }
  async function handleSave() {
    setSaving(true);
    try {
      if (modal === "add") await createProduct(form);
      else await updateProduct(modal.NUMBER, form);
      setModal(null);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setConfirmId(null);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="state-msg">Loading products...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Products</h2>
        <span className="count">{products.length} items</span>
        <button
          className="btn-primary"
          style={{ marginLeft: "auto" }}
          onClick={openAdd}
        >
          + Add product
        </button>
      </div>

      <div className="card-grid">
        {products.map((p, i) => {
          const col = CATEGORY_COLORS[p.CATEGORY] || {
            bg: "#1e1e1e",
            text: "#ccc",
          };
          return (
            <div
              className="product-card"
              key={p.NUMBER}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="product-card__top">
                <span
                  className="cat-badge"
                  style={{ background: col.bg, color: col.text }}
                >
                  {p.CATEGORY}
                </span>
                <span className="manufacturer">{p.MANNAME}</span>
              </div>
              <h3 className="product-card__name">{p.NAME}</h3>
              <p className="product-card__desc">{p.DESCRIPTION}</p>
              <div className="product-card__footer">
                <div className="product-card__meta">
                  <span>{p.GRAMMAGE}g</span>
                  <span className="dot">·</span>
                  <span>{p.QUANTITY} in stock</span>
                </div>
                <span className="price">€{Number(p.PRICE).toFixed(2)}</span>
              </div>
              <div className="card-actions">
                <button className="btn-sm" onClick={() => openEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn-sm btn-danger"
                  onClick={() => setConfirmId(p.NUMBER)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit modal */}
      {modal !== null && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">
              {modal === "add" ? "Add product" : "Edit product"}
            </h3>

            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFieldChange}
            />
            <Field
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFieldChange}
            />
            <Field
              label="Grammage (g)"
              name="grammage"
              value={form.grammage}
              onChange={handleFieldChange}
              type="number"
            />
            <Field
              label="Price (€)"
              name="price"
              value={form.price}
              onChange={handleFieldChange}
              type="number"
            />
            <Field
              label="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleFieldChange}
              type="number"
            />

            <div className="field">
              <label>Manufacturer</label>
              <select
                value={form.manname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, manname: e.target.value }))
                }
              >
                <option value="">— select —</option>
                {mfrs.map((m) => (
                  <option key={m.NAME} value={m.NAME}>
                    {m.NAME}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={form.catno}
                onChange={(e) =>
                  setForm((f) => ({ ...f, catno: e.target.value }))
                }
              >
                <option value="">— select —</option>
                {cats.map((c) => (
                  <option key={c.NUMBER} value={c.NUMBER}>
                    {c.NAME}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal__actions">
              <button className="btn-ghost" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmId !== null && (
        <div className="overlay" onClick={() => setConfirmId(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Delete product?</h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              This action cannot be undone.
            </p>
            <div className="modal__actions">
              <button className="btn-ghost" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn-danger-solid"
                onClick={() => handleDelete(confirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
