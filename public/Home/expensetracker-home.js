window.addEventListener('DOMContentLoaded', async () => {
    try {

        const token = localStorage.getItem('token')

        if(token != null){  

                // await axios.get('http://54.167.151.207/get-all-expenses', {
                //     headers: {'authorization': token}
                // })
                // .then(res => {
                //     for(let i=0; i<res.data.length; i++){
                //         showExpenseOnScreen(res.data[i])
                //     }
                // })
        
                const decodedToken = parseJwt(token)
            
                if(decodedToken.isPremiumUser){
                    showPremiumFeatures() 
                } else{
                    console.log('Not premium user')
                }

        const page = 1
        getExpense(page)

        } else {
            window.location.href = "../Login/login.html"
        }  

    } catch(err){
        console.log('Error is ', err)
        document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:red; margin-top:30px;">${err}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)
    }
})

//Need to finalize
async function getExpense(page) {

    const count = localStorage.getItem("count")

    document.getElementById("list").innerHTML = ""

    const token = localStorage.getItem('token')

    const dbData = await axios.get(`http://54.167.151.207/get-all-expenses?page=${page}&count=${count}`, {
        headers: {'authorization': token}
    })

        .then(response => { 

            response.data.rows.forEach( element => {
                showExpenseOnScreen(element)
            })
            // sendToUi(response.data.rows) 
            // console.log(response.data)
            showPagination(response.data) 
        })
        .catch(err => console.log(err))

    return dbData;
}

//Need to finalize
async function showPagination({
    currentpage,
    nextpage,
    previouspage,
    hasnextpage,
    haspreviouspage,
    lastpage
}){
    
    const pagination = document.getElementById("pagination")
    pagination.innerHTML = ""

    //previous page code
    if(haspreviouspage) {

        const prevBtn = document.createElement('button')

        prevBtn.innerHTML = `<a class="page-link">Previous</a>`
        prevBtn.addEventListener('click', async () => { await getExpense(previouspage) })
        pagination.appendChild(prevBtn)
        pagination.append(" ")
    }

    //current page code
    if(currentpage == lastpage){
        
        const currbtn = document.createElement('button')
   
        currbtn.innerHTML =  `<a class="page-link" style="padding-bottom:20px; padding-top:20px">${currentpage}</a>`

        pagination.appendChild(currbtn)
        pagination.append(" ")

    } else{
        const currbtn = document.createElement('button')
   
        currbtn.innerHTML =  `<a class="page-link" style="padding-bottom:20px; padding-top:20px">${currentpage}</a>`

        pagination.appendChild(currbtn)
        pagination.append(" ")
    }

    //next page code
    if(hasnextpage) {

        const nextBtn = document.createElement('button');
      
        nextBtn.innerHTML = `<a class="page-link">Next</a>`;
        nextBtn.addEventListener('click', async () => { await getExpense(nextpage) })
        pagination.appendChild(nextBtn)
    }
}

//Need to finalize
function setCountInLocalStorage() {
    localStorage.setItem("count", document.getElementById("NumberofRecords").value)
    location.reload()
}

function showExpenseOnScreen(expense){
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
        }

        await axios.post('http://54.167.151.207/add-expense', obj, {
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

async function deleteExpense(id){

    try{
        const token = localStorage.getItem('token')

        await axios.delete(`http://54.167.151.207/delete-expense/${id}`, {
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
        const response = await axios.get('http://54.167.151.207/purchase/premium', { headers: {'authorization': token}}) //Informing backend that a user wants to buy premium and in backend order_id is created and sent, which gets stored in const response variable here
        const order_id = response.data.order.id 

        let options = {
            "key": response.data.key_id, 
            "order_id": response.data.order.id,
    
            //this handler will handle the success payment
            "handler": async (res) => {
                const backEndRes = await axios.post('http://54.167.151.207/updateTransactionStatus', {
                    order_id: options.order_id,
                    payment_id: res.razorpay_payment_id //given by razorpay(res here is given by razorpay)
                }, { headers: {'authorization': token }})
    
                alert('you are a premium user now')

                showPremiumFeatures()  
                localStorage.setItem('token', backEndRes.data.token)
            }   
        }
    
        const rzp = new Razorpay(options) 
        rzp.open()
        e.preventDefault()
    
        rzp.on('payment.failed', async (res) => {
            console.log(res)

            await axios.post('http://54.167.151.207/updateTransactionStatus/failed', {
                order_id: order_id
                }, { headers: {'authorization': token }})

            alert('Payment Failed, Amount if debited will be refunded')
        })

    } catch(err){
        console.log(err)
    } 
}

function showPremiumFeatures(){

    try{
        document.getElementById('razorpay-button').style.visibility = 'hidden'
        document.getElementById('message').innerHTML = 'Kudos!!! You are a premium user now!  '

        let showLeaderBoardInputButton = document.createElement('input')
        showLeaderBoardInputButton.type = 'button'
        showLeaderBoardInputButton.id = 'show-leader-board-button'
        showLeaderBoardInputButton.value = 'Show Leader Board'

        showLeaderBoardInputButton.onclick = async () => {
            const token = localStorage.getItem('token')
            const leaderBoardArray = await axios.get('http://54.167.151.207/premium/showleaderboard', {
                headers: {'authorization': token}
            })

            
            let leaderBoardElement = document.getElementById('leader-board')
            leaderBoardElement.innerHTML = ''
            leaderBoardElement.innerHTML += '<h1>Leader Board</h1>'

            console.log(leaderBoardArray)

            leaderBoardArray.data.forEach(userDetails => {
                leaderBoardElement.innerHTML += `<li>Name: ${userDetails.name}---Total Expense: ${userDetails.totalExpense || 0}</li>`
            })
        }

        let parDiv = document.getElementById('message')
        parDiv.appendChild(showLeaderBoardInputButton)
        
    } catch(err){
        console.log(err)
    }
        
}

function showLeaderBoard(){
    console.log('show leader board button clicked')
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById('download-expenses-button').onclick = async (e) => {
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://54.167.151.207/download-expense', {
            headers: {'authorization': token}
        })

        if(response.status == 200){

            let a = document.createElement('a')
            a.href = response.data.fileURL
            a.download = 'myexpense.csv'
            a.click()
        }

    } catch(err){
        console.log(err)
    }
}

document.getElementById('show-old-downloads-button').onclick = async (e) => {
    try{
            const token = localStorage.getItem('token')

            let previousDownloadsElement = document.getElementById('previous-downloads')
            previousDownloadsElement.innerHTML = ''
            previousDownloadsElement.innerHTML += '<h1>Previous Downloads</h1>'

            const oldDownloads = await axios.get('http://54.167.151.207/get-old-downloads', {
                headers: {'authorization': token}
            })

            if(oldDownloads.status == 200){

                oldDownloads.data.forEach(element => {

                    previousDownloadsElement.innerHTML += `<li>${element.fileName}<button onclick="downloadFile('${element.fileURL}')">Download</button></li>`

                })
            }

    } catch(err){
        console.log(err)
    }
}

function downloadFile(fileURL){

        let a = document.createElement('a')
        a.href = fileURL
        a.download = 'myexpense.csv'
        a.click()
}