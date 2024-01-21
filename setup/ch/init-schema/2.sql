ALTER TABLE default.webperf_rum_events
    ADD COLUMN IF NOT EXISTS mob_dl Nullable(UInt16),
    ADD COLUMN IF NOT EXISTS mob_rtt Nullable(UInt16),
    ADD COLUMN IF NOT EXISTS mob_etype LowCardinality(Nullable(String))