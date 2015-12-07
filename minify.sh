ECHO "[COMPILING]"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
# uglifyjs jcomponent.js -c -o jcomponent.min.js
# uglifyjs jcomponent.js -c -m -o jcomponent.min.js
total --minify jcomponent.js