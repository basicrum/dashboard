FROM grafana/grafana:9.3.1

# Addeding the necessary Grafana plugins
ADD artefacts/plugins/ae3e-plotly-panel-0.5.0.tar.gz /var/lib/grafana/plugins/ae3e-plotly-panel
ADD artefacts/plugins/vertamedia-clickhouse-datasource-2.5.1.tar.gz /var/lib/grafana/plugins/vertamedia-clickhouse-datasource

# Adding datasources
ADD build/datasources /etc/grafana/provisioning/datasources

# Adding dashboars
ADD build/dashboards /etc/grafana/provisioning/dashboards


###### Customization ########################################
USER root


# Replace Favicon
COPY artefacts/img/basicrum_logo_fav32.png /usr/share/grafana/public/img/fav32.png

# Replace Logo
COPY artefacts/img/basicrum_logo.svg /usr/share/grafana/public/img/grafana_icon.svg

# Update Title
RUN sed -i 's|<title>\[\[.AppTitle\]\]</title>|<title>Basic RUM</title>|g' /usr/share/grafana/public/views/index.html

# Update Javascript
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|"AppTitle","Grafana"|"AppTitle","Basic RUM"|g' {} \;
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|"Welcome to Grafana"|"Welcome to Basic RUM"|g' {} \;
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|"https://grafana.com/docs/grafana/latest"|"https://www.basicrum.com"|g' {} \;
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|,{value:1,label:"Tutorials",href:"https://grafana.com/tutorials"},{value:2,label:"Community",href:"https://community.grafana.com"},{value:3,label:"Public Slack",href:"http://slack.grafana.com"}||g' {} \;
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|utm_source=grafana_gettingstarted|utm_source=basicrum_gettingstarted|g' {} \;

#############################################################