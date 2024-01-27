SELECT
    intDiv($$column_name, $bucket_size) * $bucket_size as value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND $$column_name > 0
    AND $$column_name < 10000
    AND event_type = 'visit_page'
    AND browser_name = '$$browser_name'
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY value
ORDER BY value
WITH FILL FROM 0 TO 10000 STEP $bucket_size