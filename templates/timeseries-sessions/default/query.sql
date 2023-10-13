SELECT
    event_date,
    uniq(session_id) as sessions_per_day
FROM $table
WHERE 
  $timeFilter
  AND event_type = 'visit_page'
  AND visibility_state = 'visible'
  AND device_type = '$$device_type'
  AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))
GROUP BY event_date
ORDER BY event_date

