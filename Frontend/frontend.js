window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        await axios.get('http://localhost:5/get-all-expenses', {
            headers: {'authorization': token}
        })
        .then(res => {
            console.log(res.data)
            for(let i=0; i<res.data.length; i++){
                showExpenseOnScreen(res.data[i])
            }
        })
        .catch(err => {
            console.log(err)
        })

    } catch(err){
        console.log(err)
    }
})

async function saveExpenseToDatabase(e){
    e.preventDefault()

    try{
        const token = localStorage.getItem('token')

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        let obj={
            amount,
            description,
            category

        };
        console.log(obj)

        await axios.post('http://localhost:5/add-expense', obj, {
            headers: {'authorization': token}
        })
        .then(res => {

            showExpenseOnScreen(res.data)

            document.getElementById('amount').value = ''
            document.getElementById('description').value = ''
            
        })
        .catch(err => {
            console.log(err)
        })

    } catch(err){
        console.log(err)
    }
    

}


function showExpenseOnScreen(expense){
    
    console.log(expense)
    try{
        let expenseLi = `<li id='${expense.id}'><span>${expense.amount}-${expense.description}-${expense.category}</span>
        <button onclick=deleteExpense('${expense.id}') class="delete-buttons">Delete</button>
        <button onclick=editExpense(${expense.id})>Edit</button>
        </li>`
        let parDiv = document.getElementById('list')

        parDiv.innerHTML = parDiv.innerHTML + expenseLi
    }
    catch(err){
        console.log(err)
    }
}

async function deleteExpense(id){

    try{
        const token = localStorage.getItem('token')

        await axios.delete(`http://localhost:5/delete-expense/${id}`, {
            headers: {'authorization': token}
        })
        .then(res => {
            removeExpenseFromUi(id)
        })
        .catch(err => {
            console.log(err)
        })

    } catch(err){
        console.log(err)
    }
    
}

function removeExpenseFromUi(id){
    try{
        let elemToRemove = document.getElementById(`${id}`)
        let parDiv = elemToRemove.parentElement
        parDiv.removeChild(elemToRemove)

    } catch(err){
        console.log(err)
    }
    
}

function editExpense(id){
    try{
            let content = document.getElementById(id).firstElementChild.innerText
            let vals = content.split('-')
            console.log(vals)

            document.getElementById('amount').value = vals[0]
            document.getElementById('description').value = vals[1]
            document.getElementById('category').value = vals[2]
            deleteExpense(id)

    } catch(err){
        console.log(err)
    }
}
