async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const loginDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://54.167.151.207:3000/user/login', loginDetails)

        if(response.status === 200){
            
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data.message}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)

            localStorage.setItem('token', response.data.token)

            const isPremiumUser = response.data.isPremiumUser

            console.log(response.data.token)
            window.location.href = "../Home/expensetracker-home.html"

            if(isPremiumUser){
                showPremiumFeatures()
            } 

        } else {
            throw new Error(response.data.message)
        }

    } catch(err){

            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${err}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)
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
        // const leaderBoardArray = await axios.get('http://54.167.151.207:3000/premium/showleaderboard', {
        //     headers: {'authorization': token}
        // })

        // console.log(leaderBoardArray)
        console.log('hi bud')

        let leaderBoardElement = document.getElementById('leader-board')
            leaderBoardElement.innerHTML += '<h1>Leader Board</h1>'
            // leaderBoardArray.data.forEach(userDetails => {
            //     leaderBoardElement.innerHTML += `<li>Name: ${userDetails.name}--Total Expense:${userDetails.total_cost}</li>`
            // });
    }

    let parDiv = document.getElementById('message')
    parDiv.appendChild(showLeaderBoardInputButton)
}