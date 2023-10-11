SELECT
    toDate(event_date) as t,
    quantile(0.75)($metric) as metic_75th_percentile


FROM $table

WHERE t BETWEEN toDateTime($from) AND toDateTime($to)
    AND event_type = 'visit_page'
    $conditionalTest(AND device_type in($device_type), $device_type)
    AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))
GROUP BY t