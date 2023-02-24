const User = require('../Models/user-model')
const Expense = require('../Models/expense-model')

const showLeaderBoard = async (req, res, next) => {
    try{    
            const users = await User.findAll()
            const expenses = await Expense.findAll()
            const userMatchedExpenses = {}
            
            expenses.forEach((expense) => {

                if(userMatchedExpenses[expense.UserId]){
                    userMatchedExpenses[expense.UserId] = userMatchedExpenses[expense.UserId] + expense.amount
                } else{
                    userMatchedExpenses[expense.UserId] = expense.amount
                }
            })

            let userLeaderBoardDetails = []
            users.forEach(user => {
                userLeaderBoardDetails.push({name : user.name, totalExpense: userMatchedExpenses[user.id]})
            })

            console.log(userLeaderBoardDetails)

            userLeaderBoardDetails.sort((a, b) => {
                return  b.totalExpense - a.totalExpense 
            })

            res.status(200).json(userLeaderBoardDetails)

    } catch(err){
        console.log(err)
    }
}

module.exports = {
    showLeaderBoard
}