"use client";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  item: string;
  costo_bases: number; 
  tiempo: number;
}

function formatTiempo(minutos: number): string {
  return `${minutos} min`;
}

export default function Integrante1() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ item: "", costo_bases: "", tiempo: "" });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.item.trim() || !form.costo_bases || !form.tiempo) {
      alert("Por favor rellena todos los campos");
      return;
    }

    const yaExiste = items.some(
      (it) => it.item.toLowerCase() === form.item.trim().toLowerCase()
    );

    if (yaExiste) {
      alert("Ese arte ya existe");
      return; 
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          item: form.item.trim(), 
          costo_bases: Number(form.costo_bases), 
          tiempo: Number(form.tiempo) 
        }),
      });

      if (res.ok) {
        alert("Registrado correctamente");
        setForm({ item: "", costo_bases: "", tiempo: "" });
        await fetchItems(); 
      } else {
        const data = await res.json();
        alert(data.error || "Error al registrar");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <style>{`
        .main-container {
          background-color: #000;
          color: #fff;
          min-height: 100vh;
          padding: 20px;
          font-family: sans-serif;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 250px;
          margin-bottom: 30px;
        }
        .form-container input {
          background-color: #000;
          border: 1px solid #fff;
          color: #fff;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }
        .btn-guardar {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 10px;
          width: fit-content;
          min-width: 100px;
          cursor: pointer;
          font-size: 14px;
          border-radius: 2px;
          margin-top: 5px;
        }
        .btn-guardar:hover {
          background-color: #2563eb;
        }

        /* Estilo de la Tabla con Neón y Centrado */
        .table-wrapper {
          border: 1px solid #00ff9d;
          box-shadow: 0 0 15px rgba(0, 255, 157, 0.4);
          border-radius: 2px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #000;
        }
        th, td {
          border: 1px solid #00ff9d;
          padding: 12px;
          text-align: center; /* CENTRADO DE TEXTO */
          color: #00ff9d;
          font-size: 14px;
        }
        th {
          font-weight: bold;
        }
      `}</style>

      <h1>Manualidades de Arte</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input 
          type="number" 
          placeholder="Posición" 
          value={form.costo_bases}
          onChange={e => setForm({ ...form, costo_bases: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Nombre del arte" 
          value={form.item}
          onChange={e => setForm({ ...form, item: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="Tiempo en minutos" 
          value={form.tiempo}
          onChange={e => setForm({ ...form, tiempo: e.target.value })} 
        />
        <button type="submit" className="btn-guardar" disabled={loading}>
          {loading ? "..." : "Guardar"}
        </button>
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Posición</th>
              <th style={{ width: "45%" }}>Nombre</th>
              <th style={{ width: "30%" }}>Tiempo(Minutos)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3}>Sin registros</td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id}>
                  <td>{it.costo_bases}</td>
                  <td>{it.item}</td>
                  <td>{formatTiempo(it.tiempo)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}