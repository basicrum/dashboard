SELECT
    toDate(event_date) as t,
    countIf(device_type = 'desktop') as desktop,
    countIf(device_type = 'tablet') as tablet,
    countIf(device_type = 'mobile') as mobile,
    countIf(device_type = 'bot') as bot

FROM $table

WHERE t BETWEEN toDateTime($from) AND toDateTime($to)
    AND event_type = 'visit_page'
    $conditionalTest(AND hostname in($hostname), $hostname)
GROUP BY t