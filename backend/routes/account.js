const express = require('express')
const { UserMiddleWare } = require('../middleware')
const {User , Account} = require('../db')

const accountRouter = express.Router()



accountRouter.get('/balance' ,UserMiddleWare , async (req , res) => {
    const username = req.username
    const user = User.findOne({username})
    const account = await Account.findOne({userId : user._id})

    res.json({
        balance : account.balance
    })
})

module.exports = {
    accountRouter
}