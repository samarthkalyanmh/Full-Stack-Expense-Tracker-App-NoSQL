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
        console.log(response)

    } catch(err){
        console.log(err)    
    }
}