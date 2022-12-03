SELECT
    intDiv(first_byte_duration, $bucket_size) * $bucket_size as first_byte_duration_value,
    sum(toUInt64(1)) as count

FROM $table

WHERE
    $timeFilter
    AND first_byte_duration > 100
    AND first_byte_duration < 10000
    AND event_type = 'visit_page'
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY first_byte_duration_value
ORDER BY first_byte_duration_value