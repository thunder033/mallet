echo build started
call tsc -p .\
call browserify --fast -d -s mallet --no-bundle-external --noparse=D:\git\mallet\node_modules\angular\angular.min.js src\mallet\index.js -o dist\index.js
REM call tsc -p .\test
call browserify -d --im --noparse=D:\git\mallet\node_modules\angular\angular.min.js test\app\test-webgl.module.js -o test\build\bundle-webgl.js
echo build finished