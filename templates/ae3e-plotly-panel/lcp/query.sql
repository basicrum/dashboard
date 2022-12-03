SELECT
    intDiv(largest_contentful_paint, $bucket_size) * $bucket_size as largest_contentful_paint_value,
    sum(toUInt64(1)) as count

FROM $table

WHERE
    $timeFilter
    AND largest_contentful_paint > 100
    AND largest_contentful_paint < 10000
    AND event_type = 'visit_page'
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY largest_contentful_paint_value
ORDER BY largest_contentful_paint_value