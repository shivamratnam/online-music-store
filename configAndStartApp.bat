set projectPath=%cd%
call npm install
cd \
mkdir MongoDB\Server\data\
mkdir MongoDB\Server\log\

cd MongoDB\Server
set dbPath=%cd%
cd \

start cmd /k mongod --dbpath %dbPath%\data\ --logpath %dbPath%\log\db.log
mongoimport --db musicStore --collection products --file %projectPath%\db_files\products.json --jsonArray
cd %projectPath%
node app.js