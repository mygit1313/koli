:move App\Stores\rootStore.js App\Stores\RootStore.js
:npm i -D jetifier && npx jetify

rmdir /s/q android\app\src\main\res\drawable-mdpi
rmdir /s/q android\app\src\main\res\drawable-xhdpi
rmdir /s/q android\app\src\main\res\drawable-xxhdpi
rmdir /s/q android\app\src\main\res\drawable-xxxhdpi
rmdir /s/q android\app\src\main\res\drawable-hdpi

rmdir /s/q android\app\src\main\res\raw
