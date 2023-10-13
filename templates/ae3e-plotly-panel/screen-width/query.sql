SELECT
    intDiv(screen_width, 100) * 100 as screen_width,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND screen_width <= 2500
    AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))

GROUP BY screen_width
ORDER BY screen_width
