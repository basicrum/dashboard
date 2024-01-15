SELECT
    intDiv($$column_name, 0.01) * 0.01 as value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND $$column_name IS NOT NULL
    AND browser_name = '$$browser_name'
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY value
ORDER BY value