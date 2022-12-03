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
    AND session_id in(
      select session_id
      from $table
      where event_type = 'visit_page'
      $conditionalTest(AND hostname in($hostname), $hostname)
      group by session_id
      having count(session_id) = 1
    )

GROUP BY first_byte_duration_value
ORDER BY first_byte_duration_value