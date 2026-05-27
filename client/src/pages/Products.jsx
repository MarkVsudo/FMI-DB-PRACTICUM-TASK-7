import { useFetch } from "../hooks/useFetch";
import { getProducts } from "../api";

const CATEGORY_COLORS = {
  "Dark Chocolate": { bg: "#2a1a0e", text: "#d4a96a" },
  "Milk Chocolate": { bg: "#2e1d10", text: "#e8c08a" },
  "White Chocolate": { bg: "#2a2010", text: "#f0d9a0" },
  Pralines: { bg: "#1e1a2e", text: "#c4a8e0" },
};

export default function Products() {
  const { data, loading, error } = useFetch(getProducts);
  if (loading) return <div className="state-msg">Loading products...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Products</h2>
        <span className="count">{data.length} items</span>
      </div>
      <div className="card-grid">
        {data.map((p, i) => {
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
