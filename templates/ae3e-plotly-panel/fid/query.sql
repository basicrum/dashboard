SELECT
    intDiv(first_input_delay, 20) * 20 as first_input_delay_value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND first_input_delay < 500
    AND event_type = 'visit_page'
    and browser_name = 'Chrome'
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY first_input_delay_value
ORDER BY first_input_delay_value
