# Mallet

## SymLinking the src directory for test app

### Windows
In an **Administrator** command prompt (apprently **not cmder**), using absolute paths:

`mklink /d <mallet path>\node_modules\mallet <mallet path>\dist\`

### Linux

`ln -fs src/mallet node_modules/mallet`

## Consuming as local development dependency

Install as a file dependency in package.json (one or both):

```
"mallet": "file:<path-to-mallet>",
"mallet-dev":<path-to-mallet>/dist
```