import { useFetch } from "../hooks/useFetch";
import { getCategories } from "../api";

export default function Categories() {
  const { data, loading, error } = useFetch(getCategories);
  if (loading) return <div className="state-msg">Loading...</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  return (
    <section>
      <div className="page-header">
        <h2>Categories</h2>
        <span className="count">{data.length} types</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.NUMBER}>
                <td className="muted">{c.NUMBER}</td>
                <td>
                  <strong>{c.NAME}</strong>
                </td>
                <td className="muted">{c.DESCRIPTION}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
