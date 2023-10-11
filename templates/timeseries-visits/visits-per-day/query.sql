SELECT
    toDate(event_date) as t,
    countIf(device_type = 'mobile') as Mobile,
    countIf(device_type = 'desktop') as Desktop
FROM $table

WHERE
    $timeFilter

    AND event_type = 'visit_page'
    AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))

GROUP BY t
ORDER BY t
