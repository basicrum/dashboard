SELECT hostname, subscription_id as `Subscription ID`, subscription_expire_at as `Expire At` from webperf_rum_own_hostnames where username = '${__user.login}' order by hostname