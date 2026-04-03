import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de tener configurado tu lib/db.ts como vimos antes

// Método GET: Devuelve todas las técnicas para mostrarlas en la tabla
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM pintura_arte ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los datos de la base de datos.' }, { status: 500 });
  }
}

// Método POST: Recibe los datos de tu formulario y los guarda en MySQL
// Método POST: Recibe los datos y los guarda, verificando que no existan antes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { item, costo_bases, tiempo } = body;

    // 1. Validación de seguridad básica
    if (!item || !costo_bases || !tiempo) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // 2. NUEVO PASO: Verificar si la técnica ya existe en la base de datos
    // Buscamos si ya hay un registro con exactamente el mismo nombre de 'item'
    const [existingItems]: any = await pool.query(
      'SELECT id FROM pintura_arte WHERE item = ?',
      [item]
    );

    // Si la búsqueda devuelve algo (la lista es mayor a 0), significa que ya existe
    if (existingItems.length > 0) {
      // Devolvemos un error personalizado al frontend
      return NextResponse.json({ error: 'Esta técnica ya ha sido ingresada.' }, { status: 400 });
    }

    // 3. Si no existe, procedemos a insertar en la base de datos
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