ECHO "[COMPILING]"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
uglifyjs jc.js --config-file minify.json -o jc.min.js