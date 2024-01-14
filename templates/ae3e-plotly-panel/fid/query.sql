SELECT
    intDiv($$column_name, 20) * 20 as value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND $$column_name < 400
    AND event_type = 'visit_page'
    AND browser_name = '$$browser_name'
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY value
ORDER BY value