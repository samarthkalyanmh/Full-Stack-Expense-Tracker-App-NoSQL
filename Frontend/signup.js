async function signup(e){
    
    try{
        e.preventDefault()
    
        let name = document.getElementById('name').value
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const userDetails = {
            name,
            email,
            password
        }
    
        const response = await axios.post('http://localhost:5/user/signup', userDetails)
        // console.log(response)
        
        document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data.message}</h2>`

        setTimeout(()=>{
            document.body.removeChild(document.body.lastElementChild) 
        }, 2000)

        if(response.status === 201){
            window.location.href = "./login.html"
        }

    } catch(err){
        console.log(err)    
        document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:red; margin-top:30px;">${err}</h2>`
        setTimeout(()=>{
            document.body.removeChild(document.body.lastElementChild) 
        }, 3000)
    }
}