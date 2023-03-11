async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const loginDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://localhost:3000/user/login', loginDetails)

        if(response.status === 200){
            
            displayMessage(response.data.message, true)
            console.log(response.data.message)

            localStorage.setItem('token', response.data.token)

            const isPremiumUser = response.data.isPremiumUser

            setTimeout(() => {
                window.location.href = "../Home/expensetracker-home.html"

                if(isPremiumUser){
                    showPremiumFeatures()
                } 
            }, 1000)
            
        } else {
            throw new Error(response.data.message)
        }

    } catch(errMessage){

        console.log(errMessage)
        displayMessage(errMessage, false)

    }
}

function showPremiumFeatures(){

    document.getElementById('razorpay-button').style.visibility = 'hidden'
    document.getElementById('message').innerHTML = 'Kudos!!! You are a premium user now!  '

    let showLeaderBoardInputButton = document.createElement('input')
    showLeaderBoardInputButton.type = 'button'
    showLeaderBoardInputButton.id = 'show-leader-board-button'
    showLeaderBoardInputButton.value = 'Show Leader Board'

    showLeaderBoardInputButton.onclick = async () => {
        // const token =localStorage.getItem('token')
        // const leaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', {
        //     headers: {'authorization': token}
        // })

        let leaderBoardElement = document.getElementById('leader-board')
            leaderBoardElement.innerHTML += '<h1>Leader Board</h1>'
            // leaderBoardArray.data.forEach(userDetails => {
            //     leaderBoardElement.innerHTML += `<li>Name: ${userDetails.name}--Total Expense:${userDetails.total_cost}</li>`
            // });
    }

    let parDiv = document.getElementById('message')
    parDiv.appendChild(showLeaderBoardInputButton)
}

function displayMessage(msg, successOrFailure){

    const errorDiv = document.getElementById('message')

        errorDiv.innerHTML = ''

    if(successOrFailure){
        errorDiv.innerHTML +=  `<h2 style="text-align:center; color:green; margin-top:30px;">${msg}</h2>`
    } else{
        errorDiv.innerHTML +=  `<h2 style="text-align:center; color:red; margin-top:30px;">${msg}</h2>`
    }       
}