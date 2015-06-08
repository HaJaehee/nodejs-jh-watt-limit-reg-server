/*
 *jh-watt-limit-server.js 
 *Created by HJH on 2015-06-08 at 17:55
*/

var url = require('url');
// load url module

var http = require('http');
// http object create

var mysql = require('mysql');
// load mysql module

var qs = require('querystring');
// load querystring module

var dbconnection = mysql.createConnection ({
host: 'localhost',
port: 3306,
user: 'root',
password: 'root',
database: 'watt_limit'
});//database connection option define

dbconnection.connect(function(err)
        {
        if (err)
        {
        console.error('mysql connection error');
        console.error(err);
        throw err;
        }
        });//database connection function

function onRequest(request, response) {
    console.log('requested...');
    if(request.method=='POST') {
        var body='';
        request.on('data', function (data) {
                body +=data;
                });
        request.on('end',function(){
                var POST = qs.parse(body); //POST data retrieval
                console.log(POST)
                if(POST.set_watt_hour!=undefined&&POST.set_curr_watt!=undefined)
                    insertQuery(POST.set_watt_hour, POST.set_curr_watt);

                response.writeHead(200,{'Content-Type':'text/plain'});
                response.write('watt limit is registered');
                response.end();
                });
    }//when request method is POST

    else if(request.method=='GET') {
        var url_parts = url.parse(request.url,true); //GET data retrieval
            console.log(url_parts.query);
        if
            (url_parts.query.set_watt_hour!=undefined&&url_parts.query.set_curr_watt!=undefined)
            insertQuery(url_parts.query.set_watt_hour, url_parts.query.set_curr_watt);

        response.writeHead(200,{'Content-Type'
                : 'text/plain'});
        response.write('watt limit is registered');
        response.end();
    }//when request method is GET
};

function insertQuery (watt_hour, curr_watt){ 
    var query = dbconnection.query('delete from watthour_currentwatt ',function(err,result){
            if (err)
            {
            console.error('err:'+err);
            throw err;
            }
            });
    query = dbconnection.query('insert into watthour_currentwatt (watthour,currentwatt) values("'+watt_hour+'","'+curr_watt+'") ',function(err,result){
            if (err)
            {
            console.error('err:'+err);
            throw err;
            }
            });
}//insert 'watthour and currentwatt' record into 'watthour_currentwatt' table

function onConnection(socket){
    console.log('connected...');
};

var server = http.createServer();

server.addListener('request',onRequest);
server.addListener('connection',onConnection);
server.listen(9999);
