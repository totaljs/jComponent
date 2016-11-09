ECHO "[COMPILING]"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
uglifyjs jcomponent.js --quotes=1 -c -m -o jcomponent.min.js