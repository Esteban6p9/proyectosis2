import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const [result] = await pool.query('DELETE FROM pintura_arte WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Técnica eliminada correctamente' });
    
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: 'Error al intentar eliminar el registro.' }, { status: 500 });
  }
}