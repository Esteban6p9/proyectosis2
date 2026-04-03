import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Sube un nivel extra para encontrar lib/db

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Obtenemos el ID que viene en la URL (ej: /api/items/5 -> id es "5")
    const id = params.id;

    // 2. Ejecutamos el comando SQL para borrar ese ID específico
    const [result] = await pool.query('DELETE FROM pintura_arte WHERE id = ?', [id]);

    // 3. Le avisamos a tu page.tsx que todo salió bien
    return NextResponse.json({ success: true, message: 'Técnica eliminada correctamente' });
    
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: 'Error al intentar eliminar el registro.' }, { status: 500 });
  }
}