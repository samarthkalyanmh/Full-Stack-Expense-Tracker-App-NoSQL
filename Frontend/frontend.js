window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:5/get-all-expenses')
    .then(res => {
        console.log(res.data)
        for(let i=0; i<res.data.length; i++){
            showExpenseOnScreen(res.data[i])
        }
    })
    .catch(err => {
        console.log(err)
    })
})

function saveExpenseToDatabase(e){
    e.preventDefault()

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    let obj={
        amount,
        description,
        category

    };
    console.log(obj)

    axios.post('http://localhost:5/add-expense', obj)
    .then(res => {

        showExpenseOnScreen(res.data)

        document.getElementById('amount').value = ''
        document.getElementById('description').value = ''
        document.getElementById('category').value = ''
        
    })
    .catch(err => {
        console.log(err)
    })

}


async function showExpenseOnScreen(expense){
    
    console.log(expense)
    try{
        let expenseLi = `<li id='${expense.id}'>${expense.amount}-${expense.description}-${expense.category}
        <button onclick=deleteExpense('${expense.id}') class="delete-buttons">Delete Expense</button>
        </li>`
        let parDiv = document.getElementById('list')

        parDiv.innerHTML = parDiv.innerHTML + expenseLi
    }
    catch(err){
        console.log(err)
    }
}

function deleteExpense(id){

    axios.delete(`http://localhost:5/delete-expense/${id}`)
    .then(res => {
        removeExpenseFromUi(id)
    })
    .catch(err => {
        console.log(err)
    })
}

function removeExpenseFromUi(id){
    let elemToRemove = document.getElementById(`${id}`)
    let parDiv = elemToRemove.parentElement
    parDiv.removeChild(elemToRemove)
}
