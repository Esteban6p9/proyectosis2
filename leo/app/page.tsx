"use client";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  item: string;
  costo_bases: number;
  tiempo: number;
}

export default function Integrante5() {
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
        console.error("La API devolvió un error:", data);
        setItems([]);
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
      else { setSuccess("Técnica registrada correctamente."); setForm({ item: "", costo_bases: "", tiempo: "" }); await fetchItems(); }
    } catch { setError("Error de conexión."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        body { background: #f5f7fa; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .contenedor {
          max-width: 700px;
          margin: 30px auto;
          padding: 0 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .titulo {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #2c3e50;
          font-weight: 600;
        }

        .formulario {
          border: 1px solid #e0e0e0;
          padding: 15px;
          width: 320px;
          margin-bottom: 30px;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .formulario h2 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.1rem;
          color: #2c3e50;
        }

        .formulario label {
          display: block;
          margin-bottom: 4px;
          font-size: 0.9rem;
          color: #34495e;
          font-weight: 500;
        }

        .formulario input {
          width: 90%;
          padding: 8px 10px;
          margin-bottom: 10px;
          border: 1px solid #d0d8e0;
          border-radius: 4px;
          font-size: 0.95rem;
          color: #2c3e50;
          background: white;
          transition: border-color 0.3s ease;
        }

        .formulario input:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74,144,226,0.1);
        }

        .formulario button {
          padding: 8px 20px;
          cursor: pointer;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .formulario button:hover { background: #357abd; }
        .formulario button:disabled { opacity: 0.6; cursor: not-allowed; }

        .exito {
          margin-top: 10px;
          color: #27ae60;
          font-size: 0.9rem;
          background: #eafaf1;
          padding: 8px 10px;
          border-radius: 4px;
          border-left: 3px solid #27ae60;
        }

        .error-msg {
          margin-top: 10px;
          color: #e74c3c;
          font-size: 0.9rem;
          background: #fadbd8;
          padding: 8px 10px;
          border-radius: 4px;
          border-left: 3px solid #e74c3c;
        }

        .tabla h2 {
          font-size: 1.1rem;
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .tabla table {
          width: 100%;
          border-collapse: collapse;
        }

        .tabla th {
          background: #4a90e2;
          color: white;
          padding: 10px;
          text-align: left;
          border: 1px solid #3d7bc7;
          font-weight: 600;
        }

        .tabla td {
          padding: 10px;
          border: 1px solid #e0e0e0;
          color: #34495e;
        }

        .del-btn {
          padding: 4px 12px;
          cursor: pointer;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.82rem;
          transition: background 0.2s;
        }

        .del-btn:hover { background: #c0392b; }
      `}</style>

      <div className="contenedor">
        <h1 className="titulo">Registro de Arte</h1>

        <div className="formulario">
          <h2>Añadir Técnica</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre de la Técnica:</label>
            <input
              type="text"
              value={form.item}
              onChange={e => setForm({ ...form, item: e.target.value })}
              placeholder="Ej: Acuarela"
            />

            <label>Costo en bases:</label>
            <input
              type="number"
              value={form.costo_bases}
              onChange={e => setForm({ ...form, costo_bases: e.target.value })}
              placeholder="Ej: 20"
            />

            <label>Tiempo en Minutos:</label>
            <input
              type="number"
              value={form.tiempo}
              onChange={e => setForm({ ...form, tiempo: e.target.value })}
              placeholder="Ej: 300"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="exito">{success}</p>}
        </div>

        <div className="tabla">
          <h2>Lista de Técnicas</h2>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Técnica</th>
                <th>Minutos</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}>
                    No hay técnicas registradas
                  </td>
                </tr>
              ) : (
                items.map((it, i) => (
                  <tr key={it.id}>
                    <td>{i + 1}</td>
                    <td>{it.item}</td>
                    <td>{it.tiempo} min</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
