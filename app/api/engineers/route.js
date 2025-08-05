import pool from '@/lib/db';

export async function GET() {
    try {
        const query = `
            SELECT 
    e.user_ad,
    e.name,
    e.vendor,
    e.email,
    e.phone,
    ps.squad_name AS divisi,
    e.created_at,

    -- Total Projects (Distinct per project)
    COUNT(DISTINCT all_projects.register_code) AS total_projects,

    -- As PIC
    COUNT(DISTINCT p_pic.register_code) AS total_projects_as_pic,

    -- As Engineer (non-PIC only, optional: kalau mau exclude PIC)
    COUNT(DISTINCT pe.register_code) AS total_projects_as_engineer,

    -- Completed Projects (Documentation)
    COUNT(DISTINCT CASE WHEN all_projects.status_id = 3 THEN all_projects.register_code END) AS completed_projects,

    -- Ongoing Projects (status != Documentation)
    COUNT(DISTINCT CASE WHEN all_projects.status_id != 3 THEN all_projects.register_code END) AS ongoing_projects,

    -- Performance = Completed / Total Projects
    CASE 
        WHEN COUNT(DISTINCT all_projects.register_code) = 0 THEN 0
        ELSE ROUND(
            (COUNT(DISTINCT CASE WHEN all_projects.status_id = 3 THEN all_projects.register_code END)::decimal / 
            COUNT(DISTINCT all_projects.register_code)) * 100, 2
        )
    END AS performance,

    -- Efficiency (Placeholder fixed 100%)
    100 AS efficiency

FROM 
    engineer e
LEFT JOIN pic_squad ps ON e.pic_squad_id = ps.id
LEFT JOIN project_engineers pe ON e.user_ad = pe.user_ad
LEFT JOIN projects p_pic ON p_pic.pic = e.user_ad
LEFT JOIN projects all_projects ON (all_projects.pic = e.user_ad OR all_projects.register_code = pe.register_code)
GROUP BY 
    e.user_ad, e.name, e.vendor, e.email, e.phone, ps.squad_name, e.created_at
ORDER BY e.name;
        `;
        const result = await pool.query(query);
        return Response.json(result.rows);
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
