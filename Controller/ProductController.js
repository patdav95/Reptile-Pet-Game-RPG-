var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();



var routes = function()
{
    //GET
    router.route('/')
        .get(function(req,res)
        {

            conn.connect().then(function()
            {
                var sqlQuery = "SELECT * FROM Product";
                //var sqlQuery = "INSERT INTO [Products] ([ProductName], [ProductPrice]) VALUES ('pop', 21)";
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset)
                {
                    res.json(recordset.recordset);
                    conn.close();
                })

                .catch(err => {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });

            })
                .catch(err => {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
        })

//POST
router.route('/')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductName", sql.VarChar(50), req.body.ProductName)
                    request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
                    request.execute("Usp_InsertProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });

//PUT
router.route('/')
.put(function (req, res)
    {
    
    conn.connect().then(function () {
        var transaction = new sql.Transaction(conn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request.input("ProductID", sql.Int, req.body.ID)
            request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
            request.execute("Usp_UpdateProduct").then(function () {
                transaction.commit().then(function (recordSet) {
                    conn.close();
                    res.status(200).send(req.body);
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");});
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while updating data");});
        }).catch(function (err) {
            conn.close();
            res.status(400).send("Error while updating data");});
    }).catch(function (err) {
            conn.close();
            res.status(400).send("Error while updating data");});
});

//delete
router.route('/')
        .delete(function (req, res) {
            
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductID", sql.Int, req.body.ID)
                    request.execute("Usp_DeleteProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("ProductID:" + req.body.ID);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            })
        });


    return router;

    
};





module.exports = routes;
