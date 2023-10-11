SELECT
  toDate(event_date) as t,
  count() as visits

FROM $table

WHERE t BETWEEN toDateTime($from) AND toDateTime($to)
    AND event_type = 'visit_page'
    $conditionalTest(AND device_type in($device_type), $device_type)
    AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))
GROUP BY t