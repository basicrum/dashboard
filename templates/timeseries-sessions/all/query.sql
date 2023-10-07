SELECT
    event_date,
    uniq(session_id) as sessions_per_day
FROM $table
WHERE 
  $timeFilter
  AND event_type = 'visit_page'
  AND visibility_state = 'visible'
  AND device_type IN ('mobile', 'desktop', 'tablet')
  $conditionalTest(AND hostname in($hostname), $hostname)
GROUP BY event_date
ORDER BY event_date

