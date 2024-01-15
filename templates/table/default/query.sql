SELECT
  rowNumberInAllBlocks() + 1 as "#",
  quantile(0.75)($metric) as 75th_percentile,
  url

FROM $table

WHERE 
  $timeFilter
  AND event_type = 'visit_page'
  AND url IN(SELECT url
          FROM(
            SELECT
              url,
              count() as count
            FROM $table
            WHERE 
              $timeFilter
              AND event_type = 'visit_page'
              AND visibility_state = 'visible'
              AND session_length = 1
              $conditionalTest(AND device_type in($device_type), $device_type)
              $conditionalTest(AND hostname in($hostname), $hostname)
            GROUP BY url
            ORDER BY count DESC
            LIMIT 100
          )
      )
  AND event_type = 'visit_page'
  AND visibility_state = 'visible'
  AND session_length = 1
  $conditionalTest(AND device_type in($device_type), $device_type)
  $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY url
ORDER BY 75th_percentile DESC

