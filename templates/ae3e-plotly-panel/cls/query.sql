SELECT
    intDiv(cumulative_layout_shift, 0.01) * 0.01 as cumulative_layout_shift_value,
    sum(toUInt32(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND cumulative_layout_shift IS NOT NULL
    $conditionalTest(AND hostname in($hostname), $hostname)
    $conditionalTest(AND device_type in($device_type), $device_type)

GROUP BY cumulative_layout_shift_value
ORDER BY cumulative_layout_shift_value