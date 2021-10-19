set APP_VERSION=2.17

nodist use 10 && s\setenv && del /q android\app\build\outputs\apk\release\*.* & rmdir /s/q node_modules & npm i && npx jetify && npm run android && cd android && gradlew clean & gradlew assembleRelease -x bundleReleaseJsAndAssets && cd .. && dir android\app\build\outputs\apk\release\*apk && s\z.bat && s\up && dir android\app\build\outputs\apk\release\*apk && start android\app\build\outputs\apk\release
