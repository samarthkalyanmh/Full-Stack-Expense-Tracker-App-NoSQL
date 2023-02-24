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

    } catch(err){
        console.log('Error is ', err)
        document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:red; margin-top:30px;">${err}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)
    }

    if(localStorage.getItem('isPremiumUser')){
        let premiumButton = document.getElementById('razorpay-button')
        let parDiv = document.getElementById('razorpay-button').parentElement
        parDiv.removeChild(premiumButton)
        let p = document.createElement('p')
        p.innerText = 'Kudos!!! You are a premium user now!'
        parDiv.appendChild(p) 
    } else{
        console.log('Not premium user')
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

document.getElementById('razorpay-button').onclick = async (e) => {
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5/purchase/premium', { headers: {'authorization': token}}) //Informing backend that a user wants to buy premium and in backend order_id is created and sent, which gets stored in const response variable here
        const order_id = response.data.order.id 

        let options = {
            "key": response.data.key_id, 
            "order_id": response.data.order.id,
    
            //this handler will handle the success payment
            "handler": async (res) => {
                await axios.post('http://localhost:5/updateTransactionStatus', {
                    order_id: options.order_id,
                    payment_id: res.razorpay_payment_id //given by razorpay(res here is given by razorpay)
                }, { headers: {'authorization': token }})
    
                alert('you are a premium user now')
                let premiumButton = document.getElementById('razorpay-button')
                let parDiv = document.getElementById('razorpay-button').parentElement
                parDiv.removeChild(premiumButton)
                let p = document.createElement('p')
                p.innerText = 'Kudos!!! You are a premium user now!'
                parDiv.appendChild(p) 
                localStorage.setItem('isPremiumUser', true)   
            }   
        }
    
        const rzp = new Razorpay(options) 
        rzp.open()
        e.preventDefault()
    
        rzp.on('payment.failed', async (res) => {
            console.log(res)

            await axios.post('http://localhost:5/updateTransactionStatus/failed', {
                order_id: order_id
                }, { headers: {'authorization': token }})

            alert('Payment Failed, Amount if debited will be refunded')
        })

    } catch(err){
        console.log(err)
    } 
}