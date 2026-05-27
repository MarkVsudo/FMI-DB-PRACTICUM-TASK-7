import { useFetch } from "../hooks/useFetch";
import { getManufacturers } from "../api";

const FLAGS = { Switzerland: "🇨🇭", Italy: "🇮🇹", Germany: "🇩🇪", Belgium: "🇧🇪" };

export default function Manufacturers() {
  const { data, loading, error } = useFetch(getManufacturers);
  if (loading) return <div className="state-msg">Loading...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Manufacturers</h2>
        <span className="count">{data.length} brands</span>
      </div>
      <div className="card-grid card-grid--sm">
        {data.map((m, i) => (
          <div
            className="info-card"
            key={m.NAME}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="info-card__flag">{FLAGS[m.COUNTRY] || "🌍"}</div>
            <div>
              <div className="info-card__title">{m.NAME}</div>
              <div className="info-card__sub">{m.COUNTRY}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
