FROM grafana/grafana:10.2.2

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

## Remove Documentation, Support, Community in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|\[{target:"_blank",id:"documentation".*grafana_footer"}\]|\[\]|g' {} \;

## Remove Edition in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|({target:"_blank",id:"license",.*licenseUrl})|()|g' {} \;

## Remove Version in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|({target:"_blank",id:"version",.*CHANGELOG.md":void 0})|()|g' {} \;

## Remove New Version is available in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|({target:"_blank",id:"updateVersion",text:"New version available!",icon:"download-alt",url:"https://grafana.com/grafana/download?utm_source=grafana_footer"})|()|g' {} \;

## Remove News icon
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|..createElement(....,{className:.,onClick:.,iconOnly:!0,icon:"rss","aria-label":"News"})|null|g' {} \;

#############################################################

RUN /bin/bash -c 'grafana cli plugins install ae3e-plotly-panel 0.5.0'
RUN /bin/bash -c 'grafana cli plugins install vertamedia-clickhouse-datasource 2.5.1'

## Set Home Dashboard
ENV GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=/etc/grafana/provisioning/dashboards/General.json

# Adding datasources
ADD templates/datasources/default.yaml /etc/grafana/provisioning/datasources/default.yaml

# Adding dashboards yaml
ADD templates/dashboards/General.yaml /etc/grafana/provisioning/dashboards/General.yaml

# Adding dashboards
ADD build/dashboards /etc/grafana/provisioning/dashboards

