async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const loginDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://localhost:5/user/login', loginDetails)

        if(response.status === 200){
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data.message}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)
            localStorage.setItem('token', response.data.token)
            console.log(response.data.token)
            window.location.href = "./expensetracker.html"

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
