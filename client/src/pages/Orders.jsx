import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { getOrders, getOrderItems } from "../api";

const STATUS_STYLE = {
  pending: { background: "#2e2000", color: "#f0b429" },
  confirmed: { background: "#0a2e1a", color: "#4ade80" },
};

export default function Orders() {
  const { data, loading, error } = useFetch(getOrders);
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState({});

  async function toggle(orderno) {
    if (!orderno) return;

    if (expanded[orderno]) {
      setExpanded((p) => ({ ...p, [orderno]: false }));
    } else {
      if (!items[orderno]) {
        const rows = await getOrderItems(orderno);
        setItems((p) => ({ ...p, [orderno]: rows }));
      }
      setExpanded((p) => ({ ...p, [orderno]: true }));
    }
  }

  if (loading) return <div className="state-msg">Loading...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Orders</h2>
        <span className="count">{data.length} orders</span>
      </div>
      <div className="orders-list">
        {data.map((o, i) => (
          <div
            className="order-card"
            key={o.NUMBER}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className="order-card__header"
              onClick={() => toggle(o.NUMBER)}
            >
              <div className="order-card__left">
                <span className="order-no">#{o.NUMBER}</span>
                <span
                  className="status-badge"
                  style={STATUS_STYLE[o.STATUS] || {}}
                >
                  {o.STATUS}
                </span>
              </div>
              <div className="order-card__mid">
                <span>
                  {o.FNAME} {o.LNAME}
                </span>
                <span className="muted">{o.ORDER_DATE?.slice(0, 10)}</span>
              </div>
              <div className="order-card__right">
                <span className="price">
                  €{Number(o.TOTAL_VALUE).toFixed(2)}
                </span>
                <span className="chevron">
                  {expanded[o.NUMBER] ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {expanded[o.NUMBER] && items[o.NUMBER] && (
              <div className="order-card__items">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Grammage</th>
                      <th>Qty</th>
                      <th>Unit price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items[o.NUMBER].map((it) => (
                      <tr key={it.ORDER_ITEM_ID}>
                        <td>{it.PRODUCT}</td>
                        <td className="muted">{it.GRAMMAGE}g</td>
                        <td>{it.QUANTITY}</td>
                        <td>€{Number(it.UNIT_PRICE).toFixed(2)}</td>
                        <td className="price">
                          €{(it.QUANTITY * it.UNIT_PRICE).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
