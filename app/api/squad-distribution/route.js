import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const query = `
            SELECT squad_name AS name FROM pic_squad ORDER BY squad_name;
        `;

        const result = await pool.query(query);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
