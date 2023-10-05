SELECT
    geo_country_code as geohash,
    count() as cnt

FROM $table

WHERE $timeFilter

GROUP BY geohash
