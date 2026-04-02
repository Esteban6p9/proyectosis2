"use client";
import { useEffect, useState } from "react";

// ================================================================
// INTEGRANTE 2 — Estilo: Neon / Cyberpunk Dark
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

export default function Integrante2() {
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
      setError("ERROR: Campos incompletos."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: form.item, costo_bases: Number(form.costo_bases), tiempo: Number(form.tiempo) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(`ERROR: ${data.error || "Fallo en registro."}`); }
      else { setSuccess(">> REGISTRO EXITOSO"); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("ERROR: Sin conexión."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar registro?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pg { min-height: 100vh; background: #050510; font-family: 'Share Tech Mono', monospace; color: #c8ffe0; position: relative; overflow-x: hidden; }
        .scan { position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,128,0.012) 3px, rgba(0,255,128,0.012) 4px); pointer-events: none; z-index: 0; }
        .inner { position: relative; z-index: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .hdr { text-align: center; padding: 2rem 0 3rem; }
        .hdr-pre { font-size: 0.7rem; letter-spacing: 0.4em; color: #00ff88; margin-bottom: 0.5rem; }
        .hdr-title { font-family: 'Orbitron', sans-serif; font-size: 2.8rem; font-weight: 900; color: #fff; text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff8844; letter-spacing: 0.1em; }
        .hdr-line { width: 200px; height: 1px; background: linear-gradient(90deg, transparent, #00ff88, transparent); margin: 1.2rem auto 0; }
        .grid { display: grid; grid-template-columns: 360px 1fr; gap: 2rem; }
        .form-box { background: #0a0a1a; border: 1px solid #00ff8840; padding: 2rem; position: relative; }
        .form-box::before { content: ''; position: absolute; inset: -1px; background: linear-gradient(135deg, #00ff8830, transparent, #00ff8820); pointer-events: none; }
        .form-title { font-family: 'Orbitron', sans-serif; font-size: 0.65rem; letter-spacing: 0.3em; color: #00ff88; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.8rem; }
        .form-title::before { content: '//'; }
        .field { margin-bottom: 1.5rem; }
        .label { display: block; font-size: 0.65rem; letter-spacing: 0.25em; color: #00ff8899; margin-bottom: 0.5rem; text-transform: uppercase; }
        .input { width: 100%; background: #050510; border: 1px solid #00ff8840; padding: 0.7rem 1rem; color: #c8ffe0; font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .input:focus { border-color: #00ff88; box-shadow: 0 0 15px #00ff8830; }
        .submit-btn { width: 100%; padding: 0.9rem; background: transparent; border: 1px solid #00ff88; color: #00ff88; font-family: 'Orbitron', sans-serif; font-size: 0.7rem; letter-spacing: 0.3em; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
        .submit-btn:hover { background: #00ff88; color: #050510; box-shadow: 0 0 30px #00ff8860; }
        .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .msg { margin-top: 1rem; padding: 0.7rem 1rem; font-size: 0.8rem; border-left: 2px solid; }
        .msg.ok { border-color: #00ff88; color: #00ff88; background: #00ff8810; }
        .msg.err { border-color: #ff4060; color: #ff4060; background: #ff406010; }
        .table-box { background: #0a0a1a; border: 1px solid #00ff8820; padding: 2rem; }
        .table-title { font-family: 'Orbitron', sans-serif; font-size: 0.65rem; letter-spacing: 0.3em; color: #00ff88; margin-bottom: 1.5rem; }
        table { width: 100%; border-collapse: collapse; }
        thead th { font-size: 0.6rem; letter-spacing: 0.2em; color: #00ff8888; padding: 0 1rem 1rem 0; text-align: left; border-bottom: 1px solid #00ff8830; }
        tbody tr { border-bottom: 1px solid #ffffff08; transition: background 0.15s; }
        tbody tr:hover { background: #00ff8808; }
        td { padding: 0.9rem 1rem 0.9rem 0; font-size: 0.9rem; }
        .td-idx { color: #00ff8866; font-size: 0.8rem; width: 40px; }
        .td-name { color: #fff; letter-spacing: 0.05em; }
        .badge { display: inline-block; padding: 0.15rem 0.6rem; background: #00ff8815; color: #00ff88; font-size: 0.75rem; border: 1px solid #00ff8840; }
        .del-btn { background: transparent; border: 1px solid #ff406060; color: #ff4060; padding: 0.25rem 0.8rem; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .del-btn:hover { background: #ff4060; color: #fff; box-shadow: 0 0 15px #ff406060; }
        .empty { text-align: center; padding: 3rem; color: #00ff8840; font-size: 0.9rem; letter-spacing: 0.2em; }
      `}</style>
      <div className="pg">
        <div className="scan" />
        <div className="inner">
          <div className="hdr">
            <div className="hdr-pre">SISTEMA // ACTIVO</div>
            <div className="hdr-title">PINTURA & ARTE</div>
            <div className="hdr-line" />
          </div>
          <div className="grid">
            <div className="form-box">
              <div className="form-title">NUEVO_REGISTRO</div>
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
                  {loading ? "PROCESANDO..." : "REGISTRAR_TÉCNICA"}
                </button>
              </form>
            </div>
            <div className="table-box">
              <div className="table-title">REGISTROS_ACTIVOS [{items.length}]</div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TÉCNICA</th>
                    <th>COSTO_BASES</th>
                    <th>TIEMPO_ELAB</th>
                    <th>CMD</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0
                    ? <tr><td colSpan={5} className="empty">// NO_DATA_FOUND</td></tr>
                    : items.map((it, i) => (
                      <tr key={it.id}>
                        <td className="td-idx">{String(i + 1).padStart(2, "0")}</td>
                        <td className="td-name">{it.item}</td>
                        <td><span className="badge">{it.costo_bases} base{it.costo_bases !== 1 ? "s" : ""}</span></td>
                        <td style={{ color: "#c8ffe0cc" }}>{formatTiempo(it.tiempo)}</td>
                        <td><button className="del-btn" onClick={() => handleDelete(it.id)}>DEL</button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}