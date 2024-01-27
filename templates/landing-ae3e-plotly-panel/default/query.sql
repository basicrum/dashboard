SELECT
    intDiv($$column_name, $bucket_size) * $bucket_size as value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND browser_name = '$$browser_name'
    AND session_length = 1
    AND $$column_name < 12000
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY value
ORDER BY value
WITH FILL FROM 0 TO 12000 STEP $bucket_size