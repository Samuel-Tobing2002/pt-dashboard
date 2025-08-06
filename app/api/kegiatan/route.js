import pool from '@/lib/db';

export async function GET() {
    try {
        const query = `
SELECT 
    p.register_code,
    p.project_app,
    p.tanggal_migrasi,
    s.status_name,
    c.complexity_level,
    p.total_bp,
    p.scenario,
    p.remark,
    e_pic.name AS pic_name,
    ps.squad_name AS pic_squad,
    COALESCE(STRING_AGG(e_eng.name, ', '), 'N/A') AS engineers
FROM 
    projects p
JOIN 
    status s ON p.status_id = s.id
JOIN 
    complexity c ON p.complexity_id = c.id
JOIN 
    pic_squad ps ON p.pic_squad_id = ps.id
JOIN 
    engineer e_pic ON p.pic = e_pic.user_ad
LEFT JOIN 
    project_engineers pe ON p.register_code = pe.register_code
LEFT JOIN 
    engineer e_eng ON pe.user_ad = e_eng.user_ad
GROUP BY 
    p.register_code, p.project_app, p.tanggal_migrasi, s.status_name, 
    c.complexity_level, p.total_bp, p.scenario, p.remark, e_pic.name, ps.squad_name
ORDER BY 
    p.register_code;
        `;
        const result = await pool.query(query);
        return Response.json(result.rows);
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
