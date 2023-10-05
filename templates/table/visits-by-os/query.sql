SELECT operating_system, count(1) as count
FROM $table
WHERE event_type = 'visit_page'
GROUP BY operating_system
ORDER BY count() DESC