# Mallet

## SymLinking the src directory for test app

### Windows
In an **Administrator** command prompt (apprently **not cmder**), using absolute paths:

`mklink /d <mallet path>\node_modules\mallet <mallet path>\dist\`

### Linux

`ln -fs src/mallet node_modules/mallet`