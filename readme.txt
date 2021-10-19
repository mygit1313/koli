# Known Issue #

##ArgumentError: Trying to register Bundler::GemfileError for status code 4 but Bundler::GemfileError is already registered
c.f. https://github.com/rubygems/rubygems/issues/3284

gem update --system

##package android.support.v4.content does not exist

npx jetify

https://github.com/tipsi/tipsi-stripe/issues/612

##The iOS deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 6.0, but the range of supported deployment target versions is 8.0 to 13.5.99. (in target 'libwebp' from project 'Pods')

Add the following into your podfile -

post_install do |lib|
    lib.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings.delete 'IPHONEOS_DEPLOYMENT_TARGET'
        end
    end
end

You might also need to execute the following commands -

npx react-native unlink react-native-i18n
npx react-native link react-native-i18n
pod cache clean --all

https://github.com/phonegap/phonegap-plugin-push/issues/2872

##Could not find 'CFPropertyList' (on Mac OSX)

The pod is misconfigured or corrupted. Fixing pod will resolve this error.

PATH="$HOME/bin:$PATH"
sudo gem uninstall activesupport (multiple versions installed)
brew upgrade ruby
brew link --overwrite ruby
sudo gem install jazzy
brew upgrade ruby
sudo gem update
sudo gem install activesupport

sudo gem uninstall cocoapods
sudo gem install cocoapods -n /usr/local/bin

$ pod --version
1.9.3

https://juejin.im/post/6844904117521874957

## Keystore file 'C:\Users\User\koli-app2\android\app\debug.keystore' not found for signing config 'debug'.

Just download the file from official template:
https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore

and move it to the directory android\app.


Cannot fit requested classes in a single dex file (# fields: 66957 > 65536)

in build.gradle set multiDexEnabled true in default config  to avoid this error

## Error: EMFILE: too many open files, watch

brew update

brew install watchman

## "cannot find symbol import android.support.v4.app.NotificationCompat" error

e.g.

C:\Users\<username>>\koli-app2\node_modules\react-native-firebase-push-notifications\android\src\main\java\com\afrihost\firebase\notifications\DisplayNotificationTask.java:15: error: cannot find symbol
import android.support.v4.app.NotificationCompat;

Automated linking is not working for firebase push notifications for some reason.

Make sure you run the react native link for the push notifications library (react-native-firebase-push-notifications).

For both Android and iOS, link it manually -

npx react-native link react-native-firebase-push-notifications

If you have installed react-native globally, run it without the npx command.

For iOS only -

cd ios && pod install && cd ..

https://www.npmjs.com/package/react-native-firebase-push-notifications

Creating builds

Android
With command line - 
Step 1 - react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
Step 2 - cd android
Step 3 - 
    For creating staging build use the commage - ./gradlew assembleStaging
    For creating staging build use the commage - ./gradlew assembleRelease
    
From Android Stuido - 
Step 1 - react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
Step 2 - Build -> Generate Signed Bundle/APK -> APK -> choose staging/release -> Finish

iOS
Using XCode
Step 1: Select Target -> Koli/KoliQA
Step 2: Product > Destination > Generic iOS Device
Step 3: Product -> Archive

## Multiple Environment Configuration
Staging and Production envionment is used in the app. For using environment following steps should be verified

**iOS**
* Click on `koli` in the left corner of the top bar > `Manage Schemes` and scroll down to find the scheme `koli` and `KOLI QA`. Then click on Edit in the bottom left corner.
* Click on `Build accordion` (without expanding it), then on the + in the bottom left corner. Search for “React” and add the item named React (dah). Make sure to untick `Parallelize build`.
* Expand `Build` accordion, click on `Pre-actions` then for the `koli` script content should be `echo ".env.production" > /tmp/envfile` 
and for `KOLI QA` it should be `echo ".env.staging" > /tmp/envfile`

Commands for running iOS app on device.

**Staging**:
`npx react-native run-ios --scheme "KOLI QA"`

**Production**:
`npx react-native run-ios --scheme "koli"`

**Android**

* Open `android/app/build.gradle`
* Check `buildTypes` contains `release` and `staging` 

Commands for running iOS app on device.

**Staging**:
`npx react-native run-android --variant="staging"`

**Production**:
`npx react-native run-android --variant="release"`

[Multiple Environments Reference](https://medium.com/swlh/setting-up-multiple-environments-on-react-native-for-ios-and-android-c43f3128754fhttp:// "Multiple Environments Reference")

Commands for removing duplicate assets android.

rm -rf ./android/app/src/main/res/drawable-*

rm -rf ./android/app/src/main/res/raw