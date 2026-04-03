"use client";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  item: string;
  costo_bases: number;
  tiempo: number;
}

function formatTiempo(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.round((minutos / 60) * 10) / 10;
  return `${horas} hora${horas !== 1 ? "s" : ""}`;
}

export default function Integrante1() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ item: "", costo_bases: "", tiempo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) { setItems(data); }
      else { console.error("La API devolvió un error:", data); setItems([]); }
    } catch (error) { console.error("Error de conexión:", error); setItems([]); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.item || !form.costo_bases || !form.tiempo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: form.item, costo_bases: Number(form.costo_bases), tiempo: Number(form.tiempo) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al registrar."); }
      else { setSuccess("✦ Técnica registrada correctamente."); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("Error de conexión."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta técnica?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pg { min-height: 100vh; background: linear-gradient(160deg, #fdf6f9 0%, #f9f0f8 50%, #f3eefa 100%); font-family: 'Jost', sans-serif; color: #3a2a3e; }
        .top-stripe { height: 4px; background: linear-gradient(90deg, #e8a0c0, #c9a0e8, #e8a0c0); }

        .hero { padding: 3.5rem 2rem 2.5rem; text-align: center; border-bottom: 1px solid #edd8ee; }
        .hero-deco { font-size: 1rem; letter-spacing: 0.6em; color: #d8a0c8; margin-bottom: 1rem; }
        .hero-title { font-family: 'Nunito', sans-serif; font-size: 4rem; font-weight: 700; line-height: 1.1; color: #3a2a3e; letter-spacing: -0.01em; }
        .hero-title em { font-style: italic; color: #c46fa0; font-weight: 300; }
        .hero-sub { margin-top: 0.8rem; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: #c090c0; }

        .form-section { max-width: 700px; margin: 0 auto; padding: 3rem 2rem 2rem; }
        .section-label { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #b080a8; display: flex; align-items: center; gap: 0.8rem; margin-bottom: 2rem; }
        .section-label::before, .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #e8c0e0, transparent); }

        .fields-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }
        .field { display: flex; flex-direction: column; }
        .lbl { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: #b080a8; margin-bottom: 0.45rem; }
        .inp { border: none; border-bottom: 1.5px solid #e0c0d8; background: transparent; padding: 0.5rem 0; font-family: 'Jost', sans-serif; font-size: 1rem; color: #3a2a3e; outline: none; transition: border-color 0.25s; }
        .inp:focus { border-bottom-color: #c46fa0; }

        .form-footer { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
        .submit-btn { padding: 0.85rem 2.5rem; background: linear-gradient(135deg, #d490b8, #b870c0); color: #fff; border: none; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; border-radius: 30px; transition: opacity 0.2s; }
        .submit-btn:hover { opacity: 0.88; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .msg { padding: 0.6rem 1.2rem; font-size: 0.83rem; border-radius: 20px; }
        .msg.ok { color: #8040a0; background: #f8e8fc; border: 1px solid #e0b8f0; }
        .msg.err { color: #a04040; background: #fdf0f0; border: 1px solid #f0c0c0; }

        .table-section { max-width: 900px; margin: 0 auto; padding: 0 2rem 4rem; }
        .count-line { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c090c0; text-align: center; margin-bottom: 1.5rem; }
        .table-wrap { background: #fff8fc; border: 1px solid #edd8ee; border-radius: 16px; overflow: hidden; }

        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 1.5px solid #e8c0e0; background: #fdf0f8; }
        thead th { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b080a8; padding: 1rem 1.2rem; text-align: left; font-weight: 400; }
        tbody tr { border-bottom: 1px solid #f4e4f4; transition: background 0.15s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fdf0fa; }
        td { padding: 1rem 1.2rem; font-size: 0.95rem; }

        .td-num { color: #d0a0c8; width: 40px; font-size: 0.85rem; }
        .td-name { font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 600; color: #5a3060; }
        .badge { display: inline-block; padding: 0.2rem 0.8rem; background: #fce8f3; color: #c05888; font-size: 0.75rem; border-radius: 20px; border: 1px solid #f0c0d8; }
        .del-btn { background: none; border: 1px solid #e0c0d8; color: #c080b0; padding: 0.28rem 0.85rem; font-family: 'Jost', sans-serif; font-size: 0.75rem; cursor: pointer; border-radius: 20px; transition: all 0.2s; }
        .del-btn:hover { border-color: #e080a0; color: #b04070; background: #fdf0f5; }
        .empty { text-align: center; padding: 3.5rem; color: #d0a0c8; font-style: italic; font-size: 1.1rem; font-family: 'Nunito', sans-serif; }
      `}</style>

      <div className="pg">
        <div className="top-stripe" />

        <div className="hero">
          <div className="hero-deco">✦ ✦ ✦</div>
          <div className="hero-title">Pintura <em>&</em> Arte</div>
          <div className="hero-sub">Gestión de técnicas artísticas</div>
        </div>

        <div className="form-section">
          <div className="section-label">Nueva Técnica</div>
          <form onSubmit={handleSubmit}>
            <div className="fields-grid">
              <div className="field">
                <label className="lbl">Técnica / Ítem</label>
                <input className="inp" placeholder="Ej: Óleo" value={form.item}
                  onChange={e => setForm({ ...form, item: e.target.value })} />
              </div>
              <div className="field">
                <label className="lbl">Costo en bases</label>
                <input className="inp" type="number" placeholder="Ej: 20" value={form.costo_bases}
                  onChange={e => setForm({ ...form, costo_bases: e.target.value })} />
              </div>
              <div className="field">
                <label className="lbl">Tiempo (minutos)</label>
                <input className="inp" type="number" placeholder="Ej: 300" value={form.tiempo}
                  onChange={e => setForm({ ...form, tiempo: e.target.value })} />
              </div>
            </div>
            <div className="form-footer">
              {error && <div className="msg err">{error}</div>}
              {success && <div className="msg ok">{success}</div>}
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "✦ Registrar técnica"}
              </button>
            </div>
          </form>
        </div>

        <div className="table-section">
          <div className="section-label">Catálogo</div>
          <div className="count-line">{items.length} técnica{items.length !== 1 ? "s" : ""} registradas</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Técnica</th><th>Costo en bases</th><th>Tiempo de elaboración</th><th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={5} className="empty">No hay técnicas registradas aún ✦</td></tr>
                  : items.map((it, i) => (
                    <tr key={it.id}>
                      <td className="td-num">{i + 1}</td>
                      <td className="td-name">{it.item}</td>
                      <td><span className="badge">{it.costo_bases} base{it.costo_bases !== 1 ? "s" : ""}</span></td>
                      <td>{formatTiempo(it.tiempo)}</td>
                      <td><button className="del-btn" onClick={() => handleDelete(it.id)}>Eliminar</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}