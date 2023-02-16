function signup(e){
    e.preventDefault()
    
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value

    const userDetails = {
        name,
        email
    }

    axios.post('http://localhost:5/user/login', userDetails)
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        console.log(err)
    })
}