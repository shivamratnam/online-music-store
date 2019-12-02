SET projectPath=%cd%
CD \
MKDIR MongoDB\Server\data\
MKDIR MongoDB\Server\log\
start cmd /k mongod --dbpath C:\MongoDB\Server\data\ --logpath C:\MongoDB\Server\log\db.log
mongoimport --db musicStore --collection products --file %projectPath%\db_files\products.json --jsonArray
cd %projectPath%
node app.js