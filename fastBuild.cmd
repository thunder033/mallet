echo build started

call ts-node .\build\bumpBuildVersion.ts

call del /q dist\*
call tsc -p .\ || exit /b;
call dts-generator --project src --out dist/mallet-typings.d.ts
call ts-node .\build\indexGenerator.ts
call browserify -d -s mallet --noparse=D:\git\mallet\node_modules\angular\angular.min.js src\mallet\index.js -o dist\index.js
call tsc -p .\test
call browserify -d --im --noparse=D:\git\mallet\node_modules\angular\angular.min.js test\app\test-webgl.module.js -o test\build\bundle-webgl.js

@echo {>> dist/package.json
@echo "name":"mallet-dev",>> dist/package.json
@echo "version": "0.0.1">> dist/package.json
@echo }>> dist/package.json
echo build finished