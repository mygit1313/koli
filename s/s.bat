call s\setenv

del %homepath%\sonar-scanner-4.3.0.2102-windows\bin\..\conf\sonar-scanner.properties

sonar-scanner -D"sonar.projectKey=kl-mobile" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=admin" -D"sonar.password=a"
