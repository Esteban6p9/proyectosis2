"use client";
import { useEffect, useState } from "react";

// ================================================================
// INTEGRANTE 1 — Estilo: Museum / Editorial Elegante
// Tabla MySQL: pintura_arte (id, item, costo_bases, tiempo)
// API: GET /api/items  |  POST /api/items  |  DELETE /api/items/[id]
// ================================================================

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
      // Verificamos si realmente nos devolvió una lista (Array)
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("La API devolvió un error:", data);
        setItems([]); // Forzamos una lista vacía para que no explote
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setItems([]);
    }
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
      else { setSuccess("✓ Técnica registrada correctamente."); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("Error de conexión."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta técnica?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchItems(); // <-- ¡ESTO ACTUALIZA LA PÁGINA!
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pg { min-height: 100vh; background: #f5f0e8; font-family: 'EB Garamond', serif; color: #1c1c1c; }
        .top-stripe { height: 5px; background: linear-gradient(90deg, #8b4513, #c8860a, #8b4513); }
        .header { padding: 3rem 5rem 2rem; border-bottom: 1px solid #d4c4a0; display: flex; align-items: flex-end; justify-content: space-between; }
        .h-title { font-family: 'Playfair Display', serif; font-size: 3.2rem; font-weight: 400; letter-spacing: -0.01em; color: #1c1c1c; }
        .h-title em { font-style: italic; color: #8b4513; }
        .h-sub { font-size: 0.78rem; letter-spacing: 0.3em; text-transform: uppercase; color: #8b7355; }
        .body { display: grid; grid-template-columns: 380px 1fr; min-height: calc(100vh - 120px); }
        .panel { background: #fff; border-right: 1px solid #d4c4a0; padding: 3rem 2.5rem; }
        .panel-title { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: #8b7355; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.8rem; }
        .panel-title::after { content: ''; flex: 1; height: 1px; background: #d4c4a0; }
        .field { margin-bottom: 1.8rem; }
        .label { display: block; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-bottom: 0.5rem; }
        .input { width: 100%; border: none; border-bottom: 1.5px solid #d4c4a0; background: transparent; padding: 0.6rem 0; font-family: 'EB Garamond', serif; font-size: 1.05rem; color: #1c1c1c; outline: none; transition: border-color 0.25s; }
        .input:focus { border-bottom-color: #8b4513; }
        .submit-btn { width: 100%; padding: 1rem; background: #1c1c1c; color: #f5f0e8; border: none; font-family: 'EB Garamond', serif; font-size: 0.78rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; margin-top: 0.5rem; transition: background 0.2s; }
        .submit-btn:hover { background: #8b4513; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .msg { margin-top: 1rem; padding: 0.7rem 1rem; font-size: 0.88rem; border-left: 3px solid; }
        .msg.ok { border-color: #5a7a3a; color: #5a7a3a; background: #f0f5ea; }
        .msg.err { border-color: #a05040; color: #a05040; background: #f5eeec; }
        .content { padding: 3rem 4rem; }
        .count-line { font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-bottom: 2.5rem; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 2px solid #1c1c1c; }
        thead th { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8b7355; padding: 0 1rem 1rem 0; text-align: left; font-weight: 400; }
        tbody tr { border-bottom: 1px solid #e8e0d0; transition: background 0.15s; }
        tbody tr:hover { background: #faf7f2; }
        td { padding: 1.1rem 1rem 1.1rem 0; font-size: 1rem; color: #1c1c1c; }
        .td-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; }
        .badge { display: inline-block; padding: 0.2rem 0.7rem; background: #f0e8d8; color: #8b4513; font-size: 0.78rem; border-radius: 2px; letter-spacing: 0.05em; }
        .del-btn { background: none; border: 1px solid #d4c4a0; color: #8b7355; padding: 0.3rem 0.9rem; font-family: 'EB Garamond', serif; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .del-btn:hover { border-color: #a05040; color: #a05040; background: #fdf5f3; }
        .empty { text-align: center; padding: 4rem; color: #c8b89a; font-style: italic; font-size: 1.2rem; }
      `}</style>
      <div className="pg">
        <div className="top-stripe" />
        <div className="header">
          <div className="h-title">Pintura <em>&</em> Arte</div>
          <div className="h-sub">Gestión de técnicas artísticas</div>
        </div>
        <div className="body">
          <div className="panel">
            <div className="panel-title">Nueva Técnica</div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Técnica / Ítem</label>
                <input className="input" placeholder="Ej: Óleo" value={form.item}
                  onChange={e => setForm({ ...form, item: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">Costo en bases</label>
                <input className="input" type="number" placeholder="Ej: 20" value={form.costo_bases}
                  onChange={e => setForm({ ...form, costo_bases: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">Tiempo (minutos)</label>
                <input className="input" type="number" placeholder="Ej: 300" value={form.tiempo}
                  onChange={e => setForm({ ...form, tiempo: e.target.value })} />
              </div>
              {error && <div className="msg err">{error}</div>}
              {success && <div className="msg ok">{success}</div>}
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar técnica"}
              </button>
            </form>
          </div>
          <div className="content">
            <div className="count-line">{items.length} técnica{items.length !== 1 ? "s" : ""} en catálogo</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Técnica</th>
                  <th>Costo en bases</th>
                  <th>Tiempo de elaboración</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={5} className="empty">No hay técnicas registradas</td></tr>
                  : items.map((it, i) => (
                    <tr key={it.id}>
                      <td style={{ color: "#c8b89a", width: "50px" }}>{i + 1}</td>
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