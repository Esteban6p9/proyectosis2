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
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
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
        body: JSON.stringify({ 
          item: form.item, 
          costo_bases: Number(form.costo_bases), 
          tiempo: Number(form.tiempo) 
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al registrar."); }
      else { 
        setSuccess("✓ Técnica añadida a la colección."); 
        setForm({ item: "", costo_bases: "", tiempo: "" }); 
        await fetchItems(); 
      }
    } catch { setError("Error de conexión."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:wght@300;400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Fondo Negro y Estética Dark */
        .pg { min-height: 100vh; background: #0a0a0a; font-family: 'EB Garamond', serif; color: #e0e0e0; }
        .top-stripe { height: 4px; background: linear-gradient(90deg, #4a3728, #8b4513, #4a3728); }
        
        .header { padding: 3rem 5rem 2rem; border-bottom: 1px solid #2a2a2a; display: flex; align-items: flex-end; justify-content: space-between; }
        .h-title { font-family: 'Playfair Display', serif; font-size: 3.2rem; font-weight: 400; letter-spacing: -0.01em; color: #ffffff; }
        .h-title em { font-style: italic; color: #8b4513; }
        .h-sub { font-size: 0.78rem; letter-spacing: 0.3em; text-transform: uppercase; color: #666; }
        
        .body { display: grid; grid-template-columns: 380px 1fr; min-height: calc(100vh - 120px); }
        
        /* Panel Lateral Dark */
        .panel { background: #111; border-right: 1px solid #2a2a2a; padding: 3rem 2.5rem; }
        .panel-title { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: #8b4513; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.8rem; }
        .panel-title::after { content: ''; flex: 1; height: 1px; background: #2a2a2a; }
        
        .field { margin-bottom: 1.8rem; }
        .label { display: block; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 0.5rem; }
        
        .input { width: 100%; border: none; border-bottom: 1.5px solid #333; background: transparent; padding: 0.6rem 0; font-family: 'EB Garamond', serif; font-size: 1.05rem; color: #fff; outline: none; transition: border-color 0.25s; }
        .input:focus { border-bottom-color: #8b4513; }
        
        .submit-btn { width: 100%; padding: 1rem; background: #ffffff; color: #000; border: none; font-family: 'EB Garamond', serif; font-size: 0.78rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; margin-top: 0.5rem; transition: all 0.2s; font-weight: bold; }
        .submit-btn:hover { background: #8b4513; color: #fff; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        
        .msg { margin-top: 1rem; padding: 0.7rem 1rem; font-size: 0.88rem; border-left: 3px solid; }
        .msg.ok { border-color: #5a7a3a; color: #a3c186; background: #1a2015; }
        .msg.err { border-color: #a05040; color: #e5a598; background: #251816; }
        
        .content { padding: 3rem 4rem; }
        .count-line { font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-bottom: 2.5rem; }
        
        /* Tabla Dark - Sin columna Acción */
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 2px solid #333; }
        thead th { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #888; padding: 0 1rem 1rem 0; text-align: left; font-weight: 400; }
        tbody tr { border-bottom: 1px solid #1a1a1a; transition: background 0.15s; }
        tbody tr:hover { background: #151515; }
        td { padding: 1.1rem 1rem 1.1rem 0; font-size: 1rem; color: #ccc; }
        
        .td-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #fff; }
        .badge { display: inline-block; padding: 0.2rem 0.7rem; background: #1a1a1a; color: #8b4513; font-size: 0.78rem; border-radius: 2px; border: 1px solid #333; }
        
        .empty { text-align: center; padding: 4rem; color: #444; font-style: italic; font-size: 1.2rem; }
      `}</style>

      <div className="pg">
        <div className="top-stripe" />
        <div className="header">
          <div className="h-title">Pintura <em>&</em> Arte</div>
          <div className="h-sub">Catálogo de técnicas exclusivas</div>
        </div>

        <div className="body">
          <div className="panel">
            <div className="panel-title">Nueva Adquisición</div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Técnica / Ítem</label>
                <input className="input" placeholder="Ej: Óleo sobre lienzo" value={form.item}
                  onChange={e => setForm({ ...form, item: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">Costo en bases</label>
                <input className="input" type="number" placeholder="0" value={form.costo_bases}
                  onChange={e => setForm({ ...form, costo_bases: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">Tiempo (minutos)</label>
                <input className="input" type="number" placeholder="0" value={form.tiempo}
                  onChange={e => setForm({ ...form, tiempo: e.target.value })} />
              </div>

              {error && <div className="msg err">{error}</div>}
              {success && <div className="msg ok">{success}</div>}

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Procesando..." : "Registrar técnica"}
              </button>
            </form>
          </div>

          <div className="content">
            <div className="count-line">
              {items.length} Obra{items.length !== 1 ? "s" : ""} en exhibición digital
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>ID</th>
                  <th>Técnica</th>
                  <th>Costo Estimado</th>
                  <th>Tiempo de Elaboración</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={4} className="empty">La galería está vacía</td></tr>
                ) : (
                  items.map((it, i) => (
                    <tr key={it.id}>
                      <td style={{ color: "#444" }}>{String(i + 1).padStart(2, '0')}</td>
                      <td className="td-name">{it.item}</td>
                      <td>
                        <span className="badge">
                          {it.costo_bases} base{it.costo_bases !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>{formatTiempo(it.tiempo)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}