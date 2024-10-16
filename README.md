# rule-engine
TeckStack Used
Backend Language= Express.js
DataBase= MongoDB

# Steps to Setup 

Setup MongoDB Database and copy DataBase URL
 You can follow any tutorial on youtube to setup and generate DB URL
 use DRIVER Section Database URL to connect

Clone project on local Machine
    Make a empty folder name it rule-engine
    open vscode in this folder
    open terminal in vscode
    Paste this command and press enter  [ git clone https://github.com/sandeep13122002/rule-engine.git ]

Type [ cd backend ] and press enter

Paste this command and press enter [ npm install ] // this will install all package mentioned in package.json and required to run this application

Create .env file
add Envoronment VARAIABLE {DB_URL}
copy mongoDB URL here

run final project
node index.js



 #Testing Endpoints
   using postman interface to send request
  Enpoint to create new rule
  POST http://localhost:3000/create_rule
  with body example
     
{
    "rule_string": "(age < 25 OR department = 'Marketing')"
}

End point for combining rules isung rule Ids
    POST http://localhost:3000/combine_rules
    with body example
{
    "rule_ids": ["<rule_id_1>", "<rule_id_2>"]
}

End point to evaluate
    POST POST http://localhost:3000/evaluate_rules
    with body example
    {
    "ast": <AST from combine_rules response>,
    "data": {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}
}
   