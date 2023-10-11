SELECT
    intDiv($$column_name, $bucket_size) * $bucket_size as value,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND browser_name = '$$browser_name'
    AND hostname in (SELECT hostname from webperf_rum_view_hostnames where username = '${__user.login}' $conditionalTest(AND hostname in($hostname), $hostname))

GROUP BY value
ORDER BY value