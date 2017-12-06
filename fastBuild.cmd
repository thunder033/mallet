echo build started
call del /q dist\*
call tsc -p .\
call dts-generator --project src --out dist/mallet-typings.d.ts
call ts-node .\build\indexGenerator.ts
call browserify --fast -d -s mallet --no-bundle-external --noparse=D:\git\mallet\node_modules\angular\angular.min.js src\mallet\index.js -o dist\index.js
call tsc -p .\test
call browserify -d --im --noparse=D:\git\mallet\node_modules\angular\angular.min.js test\app\test-webgl.module.js -o test\build\bundle-webgl.js
echo build finished