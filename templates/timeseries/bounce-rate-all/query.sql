SELECT 
    event_date,
    bounce_rate
FROM (
  SELECT
      event_date,
      count() AS all_sessions,
      countIf(max_length = 1) AS bounced_sessions,
      ((bounced_sessions / all_sessions) * 100) as bounce_rate
  FROM
  (
      SELECT
          event_date,
          session_id,
          max(session_length) AS max_length
      FROM $table
      WHERE 
        $timeFilter
        AND event_type = 'visit_page'
        AND visibility_state = 'visible'
        AND device_type IN ('mobile','desktop','tablet')
        AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))
      GROUP BY event_date, session_id
  )
  GROUP BY event_date
)
