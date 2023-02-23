async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const userDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://localhost:5/user/login', userDetails)

        if(response.status === 200){
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data.message}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)

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
