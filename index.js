const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();

let db = null;
const dbPath = path.join(__dirname,"goodreads.db")
const initializeDBAndServer = async () =>{
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000,()=>{
            console.log("Server Running at http://localhost:3000/");
        });
    }
    catch(e){
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }    
};

initializeDBAndServer();

app.get("/books/",async (request,response) =>{
    const getBooksQuery = `
        SELECT 
        *
        FROM
        book
        ORDER BY
        book_id;`;
    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray);
});

app.get("/books/:bookid/",async (request,response)=>{
    const { bookId } = request.params;
    const getBookQuery = `
        SELECT
          *
        FROM
          book
        WHERE
          book_id = ${bookId};`;
    const book = await db.get(getBookQuery);
    response.send(book);
});