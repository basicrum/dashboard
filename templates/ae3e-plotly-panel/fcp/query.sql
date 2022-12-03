SELECT
    intDiv(first_contentful_paint, $bucket_size) * $bucket_size as first_contentful_paint_value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND first_contentful_paint_value > 100
    AND first_contentful_paint_value < 10000
    AND event_type = 'visit_page'
    and browser_name = 'Chrome'
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY first_contentful_paint_value
ORDER BY first_contentful_paint_value