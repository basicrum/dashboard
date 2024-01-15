SELECT
  bucket,
  ((bounced_sessions / all_sessions) * 100) as bounce_rate,
  all_sessions
FROM (
  SELECT
      intDiv(metricInLandingPage, $bucket_size) * $bucket_size AS bucket,
      countIf(maxLength = 1) AS bounced_sessions,
      count() AS all_sessions
  FROM
  (
      SELECT
          session_id,
          max(session_length) AS maxLength,
          argMin($metric, created_at) AS metricInLandingPage
      FROM $table
      WHERE 
        $timeFilter
        AND event_type = 'visit_page'
        AND visibility_state = 'visible'
        AND $metric > 0
        $conditionalTest(AND device_type in($device_type), $device_type)
        $conditionalTest(AND hostname in($hostname), $hostname)
      GROUP BY session_id
  )
  GROUP BY bucket
  ORDER BY bucket ASC
)
