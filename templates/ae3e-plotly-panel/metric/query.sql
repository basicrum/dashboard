SELECT
    intDiv($metric, $bucket_size) * $bucket_size as metric_value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND $metric > 0
    AND $metric < 10000
    AND event_type = 'visit_page'
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY metric_value
ORDER BY metric_value
WITH FILL FROM 0 TO 10000 STEP $bucket_size