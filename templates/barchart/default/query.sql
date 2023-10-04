SELECT
    toDate(event_date) as t, 
    countIf($$column_name <= $$needs_improvement_min_value) as good,
    countIf($$column_name > $$needs_improvement_min_value AND $$column_name <= $$needs_improvement_max_value) as needs_improvement,
    countIf($$column_name > $$needs_improvement_max_value) as poor

FROM $table

WHERE
    $timeFilter
    AND event_type = 'visit_page'
    AND browser_name = '$$browser_name'
    AND $$column_name is not null
    $conditionalTest(AND hostname in($hostname), $hostname)
GROUP BY t