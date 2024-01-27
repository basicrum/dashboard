SELECT
    intDiv(screen_width, 100) * 100 as screen_width,
    sum(toUInt64(1)) as count
    
FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND screen_width <= 2500
    $conditionalTest(AND hostname in($hostname), $hostname)

GROUP BY screen_width
ORDER BY screen_width
WITH FILL FROM 0 TO 2600 STEP 100