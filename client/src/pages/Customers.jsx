import { useFetch } from "../hooks/useFetch";
import { getCustomers } from "../api";

function initials(fname, lname) {
  return `${fname?.[0] ?? ""}${lname?.[0] ?? ""}`.toUpperCase();
}

export default function Customers() {
  const { data, loading, error } = useFetch(getCustomers);
  if (loading) return <div className="state-msg">Loading...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Customers</h2>
        <span className="count">{data.length} registered</span>
      </div>
      <div className="card-grid card-grid--sm">
        {data.map((c, i) => (
          <div
            className="info-card info-card--customer"
            key={c.EMAIL}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="avatar">{initials(c.FNAME, c.LNAME)}</div>
            <div>
              <div className="info-card__title">
                {c.FNAME} {c.LNAME}
              </div>
              <div className="info-card__sub">{c.EMAIL}</div>
              <div className="info-card__sub">{c.PHONE}</div>
              <div className="info-card__sub muted-sm">{c.ADDRESS}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
