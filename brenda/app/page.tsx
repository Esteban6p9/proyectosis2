"use client";
import { useEffect, useState } from "react";

// ================================================================
// INTEGRANTE 4 — Estilo: Brutalist / Industrial
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

export default function Integrante4() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ item: "", costo_bases: "", tiempo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.item || !form.costo_bases || !form.tiempo) {
      setError("CAMPOS INCOMPLETOS."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: form.item, costo_bases: Number(form.costo_bases), tiempo: Number(form.tiempo) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error?.toUpperCase() || "ERROR EN REGISTRO."); }
      else { setSuccess("GUARDADO CORRECTAMENTE."); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("ERROR DE SERVIDOR."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pg { min-height: 100vh; background: #e8e4dc; font-family: 'Space Mono', monospace; color: #1a1a1a; }
        .top-bar { background: #1a1a1a; color: #e8e4dc; padding: 1.2rem 3rem; display: flex; align-items: center; justify-content: space-between; }
        .top-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.08em; }
        .top-right { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
        .body { padding: 3rem; display: grid; grid-template-columns: 380px 1fr; gap: 3rem; }
        .form-block { }
        .block-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.1em; padding: 0.6rem 0; border-top: 4px solid #1a1a1a; border-bottom: 2px solid #1a1a1a; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
        .block-title span { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: #888; letter-spacing: 0.15em; }
        .field { margin-bottom: 1.5rem; }
        .label { display: block; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-bottom: 0.5rem; }
        .input { width: 100%; background: #fff; border: 2px solid #1a1a1a; padding: 0.8rem; font-family: 'Space Mono', monospace; font-size: 0.9rem; color: #1a1a1a; outline: none; transition: background 0.15s; }
        .input:focus { background: #fff9e6; }
        .submit-btn { width: 100%; padding: 1rem; background: #1a1a1a; color: #e8e4dc; border: none; font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.15em; cursor: pointer; transition: all 0.15s; margin-top: 0.5rem; }
        .submit-btn:hover { background: #d45a00; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .msg { margin-top: 1rem; padding: 0.7rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; border-left: 4px solid; }
        .msg.ok { border-color: #3a7a3a; color: #3a7a3a; background: #f0f5ea; }
        .msg.err { border-color: #d40000; color: #d40000; background: #fdf0f0; }
        .table-area { }
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 4px solid #1a1a1a; }
        thead th { font-size: 0.62rem; letter-spacing: 0.2em; font-weight: 700; padding: 0 1rem 0.8rem 0; text-align: left; text-transform: uppercase; }
        tbody tr { border-bottom: 2px solid #d0ccc4; transition: background 0.1s; }
        tbody tr:hover { background: #fff; }
        td { padding: 1rem 1rem 1rem 0; font-size: 0.88rem; }
        .td-idx { color: #aaa; font-size: 0.75rem; width: 40px; }
        .td-name { font-weight: 700; font-size: 1rem; }
        .badge { display: inline-block; background: #1a1a1a; color: #e8e4dc; padding: 0.15rem 0.6rem; font-size: 0.72rem; letter-spacing: 0.08em; }
        .del-btn { background: transparent; border: 2px solid #1a1a1a; color: #1a1a1a; padding: 0.3rem 0.8rem; font-family: 'Space Mono', monospace; font-size: 0.72rem; font-weight: 700; cursor: pointer; text-transform: uppercase; transition: all 0.15s; }
        .del-btn:hover { background: #d40000; border-color: #d40000; color: #fff; }
        .empty { padding: 3rem; text-align: center; color: #aaa; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; }
        .count { font-size: 0.7rem; letter-spacing: 0.15em; color: #888; margin-bottom: 0.5rem; }
      `}</style>
      <div className="pg">
        <div className="top-bar">
          <div className="top-title">Pintura & Arte</div>
          <div className="top-right">Gestión de técnicas artísticas</div>
        </div>
        <div className="body">
          <div className="form-block">
            <div className="block-title">Nueva Técnica <span>FORMULARIO</span></div>
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
                {loading ? "GUARDANDO" : "REGISTRAR"}
              </button>
            </form>
          </div>
          <div className="table-area">
            <div className="block-title">Lista de Técnicas <span className="count">{items.length} REGISTROS</span></div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Técnica</th>
                  <th>Costo en bases</th>
                  <th>Tiempo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={5} className="empty">SIN REGISTROS</td></tr>
                  : items.map((it, i) => (
                    <tr key={it.id}>
                      <td className="td-idx">{i + 1}</td>
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