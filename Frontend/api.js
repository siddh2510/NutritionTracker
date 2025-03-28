function fetchData(){
    fetch("https://fitness-tracker-hbou.onrender.com/api/exercise-session/calories/0")
    .then((res)=>res.json())
    .then((data)=>console.log(data))
    .catch((error)=>{
        console.error("error fetching data:",error); 
    });
}
fetchData()