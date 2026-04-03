import { NextResponse } from 'next/server';
import pool from '@/lib/db'; 

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM pintura_arte ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los datos de la base de datos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { item, costo_bases, tiempo } = body;

    if (!item || !costo_bases || !tiempo) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    const [existingItems]: any = await pool.query(
      'SELECT id FROM pintura_arte WHERE item = ?',
      [item]
    );

    if (existingItems.length > 0) {
      return NextResponse.json({ error: 'Esta técnica ya ha sido ingresada.' }, { status: 400 });
    }
    const [result] = await pool.query(
      'INSERT INTO pintura_arte (item, costo_bases, tiempo) VALUES (?, ?, ?)',
      [item, costo_bases, tiempo]
    );

    return NextResponse.json({ success: true, message: 'Técnica registrada' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al guardar en la base de datos.' }, { status: 500 });
  }
}