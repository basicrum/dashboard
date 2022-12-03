SELECT
    intDiv(first_byte_duration, 250) * 250 as first_byte_duration_value,
    sum(toUInt64(1)) as count

FROM $table

WHERE
    $timeFilter
    AND first_byte_duration > 100
    AND first_byte_duration < 10000
    AND event_type = 'visit_page'
    AND session_length = 1
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY first_byte_duration_value
ORDER BY first_byte_duration_value