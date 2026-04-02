"use client";
import { useEffect, useState } from "react";

// ================================================================
// INTEGRANTE 5 — Estilo: Art Déco / Dorado Lujoso
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

export default function Integrante5() {
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
      setError("Por favor complete todos los campos."); return;
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
      else { setSuccess("Técnica incorporada al repertorio."); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("Error de conexión con el servidor."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Retirar esta técnica del repertorio?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pg { min-height: 100vh; background: #0d0d0d; font-family: 'Libre Baskerville', serif; color: #d4a843; position: relative; overflow-x: hidden; }
        .bg-tex { position: fixed; inset: 0; background-image: radial-gradient(ellipse at 20% 50%, #1a1200 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #0d0800 0%, transparent 60%); pointer-events: none; z-index: 0; }
        .inner { position: relative; z-index: 1; }
        .header { text-align: center; padding: 3.5rem 2rem 2.5rem; border-bottom: 1px solid #d4a84340; }
        .deco-line { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1.5rem; }
        .deco-diamond { width: 8px; height: 8px; background: #d4a843; transform: rotate(45deg); }
        .deco-bar { height: 1px; width: 80px; background: linear-gradient(90deg, transparent, #d4a843, transparent); }
        .h-eyebrow { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.5em; color: #d4a84399; text-transform: uppercase; margin-bottom: 1rem; }
        .h-title { font-family: 'Cinzel', serif; font-size: 3rem; font-weight: 700; color: #d4a843; letter-spacing: 0.1em; text-shadow: 0 0 40px #d4a84340; }
        .h-sub { font-size: 0.85rem; font-style: italic; color: #d4a84388; margin-top: 0.8rem; }
        .body { display: grid; grid-template-columns: 400px 1fr; max-width: 1300px; margin: 0 auto; padding: 3rem 3rem; gap: 4rem; }
        .form-wrap { }
        .sec-title { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; color: #d4a843; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .sec-title::before, .sec-title::after { content: '◆'; font-size: 0.5rem; }
        .form-inner { background: #111100; border: 1px solid #d4a84330; padding: 2.5rem; }
        .field { margin-bottom: 1.8rem; }
        .label { display: block; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase; color: #d4a84388; margin-bottom: 0.7rem; }
        .input { width: 100%; background: transparent; border: none; border-bottom: 1px solid #d4a84350; padding: 0.6rem 0; color: #d4a843; font-family: 'Libre Baskerville', serif; font-size: 0.95rem; outline: none; transition: border-color 0.25s; }
        .input:focus { border-bottom-color: #d4a843; }
        .input::placeholder { color: #d4a84340; }
        .ornament { text-align: center; color: #d4a84330; font-size: 1.2rem; letter-spacing: 0.5em; margin: 1.5rem 0; }
        .submit-btn { width: 100%; padding: 1rem; background: transparent; border: 1px solid #d4a843; color: #d4a843; font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .submit-btn::before { content: ''; position: absolute; inset: 0; background: #d4a843; transform: scaleX(0); transform-origin: left; transition: transform 0.3s; z-index: 0; }
        .submit-btn:hover::before { transform: scaleX(1); }
        .submit-btn:hover { color: #0d0d0d; }
        .submit-btn span { position: relative; z-index: 1; }
        .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .msg { margin-top: 1.2rem; padding: 0.8rem 1rem; font-size: 0.82rem; font-style: italic; border-left: 2px solid; }
        .msg.ok { border-color: #7ab87a; color: #7ab87a; background: #7ab87a10; }
        .msg.err { border-color: #c04040; color: #c04040; background: #c0404010; }
        .table-wrap { overflow-x: auto; }
        .count { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.25em; color: #d4a84366; margin-bottom: 0.5rem; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 1px solid #d4a84350; }
        thead th { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.25em; text-transform: uppercase; color: #d4a84388; padding: 0 1.5rem 1rem 0; text-align: left; font-weight: 400; }
        tbody tr { border-bottom: 1px solid #d4a84315; transition: background 0.2s; }
        tbody tr:hover { background: #d4a84308; }
        td { padding: 1.1rem 1.5rem 1.1rem 0; }
        .td-idx { color: #d4a84344; font-family: 'Cinzel', serif; font-size: 0.75rem; width: 40px; }
        .td-name { font-size: 1.05rem; color: #e8c870; letter-spacing: 0.03em; }
        .badge { display: inline-block; padding: 0.15rem 0.7rem; border: 1px solid #d4a84350; color: #d4a843; font-size: 0.75rem; font-family: 'Cinzel', serif; letter-spacing: 0.1em; }
        .td-time { color: #d4a84399; font-size: 0.88rem; font-style: italic; }
        .del-btn { background: transparent; border: 1px solid #c0404060; color: #c04040; padding: 0.25rem 0.8rem; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.15em; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }
        .del-btn:hover { border-color: #c04040; background: #c04040; color: #fff; }
        .empty { text-align: center; padding: 4rem; color: #d4a84330; font-style: italic; font-size: 0.9rem; letter-spacing: 0.15em; }
      `}</style>
      <div className="pg">
        <div className="bg-tex" />
        <div className="inner">
          <div className="header">
            <div className="h-eyebrow">Colección de Técnicas</div>
            <div className="deco-line">
              <div className="deco-bar" /><div className="deco-diamond" /><div className="deco-bar" />
            </div>
            <div className="h-title">Pintura & Arte</div>
            <div className="h-sub">Gestión de técnicas artísticas</div>
          </div>
          <div className="body">
            <div className="form-wrap">
              <div className="sec-title">Incorporar Técnica</div>
              <div className="form-inner">
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
                  <div className="ornament">◆ ◇ ◆</div>
                  {error && <div className="msg err">{error}</div>}
                  {success && <div className="msg ok">{success}</div>}
                  <button className="submit-btn" type="submit" disabled={loading}>
                    <span>{loading ? "Registrando..." : "Registrar Técnica"}</span>
                  </button>
                </form>
              </div>
            </div>
            <div className="table-wrap">
              <div className="sec-title">Repertorio de Técnicas</div>
              <div className="count">{items.length} técnica{items.length !== 1 ? "s" : ""} en repertorio</div>
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
                    ? <tr><td colSpan={5} className="empty">El repertorio aguarda su primera técnica</td></tr>
                    : items.map((it, i) => (
                      <tr key={it.id}>
                        <td className="td-idx">{String(i + 1).padStart(2, "0")}</td>
                        <td className="td-name">{it.item}</td>
                        <td><span className="badge">{it.costo_bases} base{it.costo_bases !== 1 ? "s" : ""}</span></td>
                        <td className="td-time">{formatTiempo(it.tiempo)}</td>
                        <td><button className="del-btn" onClick={() => handleDelete(it.id)}>Retirar</button></td>
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