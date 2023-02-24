const User = require('../Models/user-model')
const Expense = require('../Models/expense-model')
const sequelize = require('../util/database')

const showLeaderBoard = async (req, res, next) => {
    try{   
            // const userLeaderBoardDetails = await User.findAll({
            //     attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense'] ],
            //     include: [
            //         {
            //             model: Expense,
            //             attributes: []
            //         }
            //     ],
            //     group:['user.id'],
            //     order:[['totalExpense', 'DESC']]
            // })
            // res.status(200).json(userLeaderBoardDetails)
            
            const sample = await User.findAll({
                attributes: ['name', 'totalExpense'],
                order: [['totalExpense', 'DESC']]
            })
            res.status(200).json(sample)

    } catch(err){
        console.log(err)
    }
}

module.exports = {
    showLeaderBoard
}