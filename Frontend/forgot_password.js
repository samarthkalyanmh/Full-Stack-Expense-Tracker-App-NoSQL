async function resetPassword(e){
    e.preventDefault()
    try{
        const email = document.getElementById('email').value
        document.getElementById('email').value = ''

        const obj = {
            email
        }
    
        const response = await axios.post('http://localhost:5/password/forgotpassword', obj)
    
        console.log(response)

    } catch(err){
        console.log(err)
    }
    
}
