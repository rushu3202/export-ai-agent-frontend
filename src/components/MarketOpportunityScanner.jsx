import { useState } from "react"

export default function MarketOpportunityScanner() {

const [product,setProduct] = useState("")
const [country,setCountry] = useState("")
const [result,setResult] = useState(null)
const [loading,setLoading] = useState(false)

async function scanMarket(){

setLoading(true)

try{

const res = await fetch("https://aihomeworkhelper-backend.onrender.com/api/export-check",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
product,
country,
experience:"beginner"
})
})

const data = await res.json()

setResult(data)

}catch(err){

console.log(err)

}

setLoading(false)

}

return (

<div className="card">

<div className="card__title">
AI Export Opportunity Scanner
</div>

<div className="card__subtitle">
Find demand and export potential instantly
</div>

<div style={{marginTop:20}}>

<input
className="input"
placeholder="Product (e.g. Turmeric Powder)"
value={product}
onChange={(e)=>setProduct(e.target.value)}
/>

<input
className="input"
placeholder="Target Country (e.g. UK)"
value={country}
onChange={(e)=>setCountry(e.target.value)}
style={{marginTop:10}}
/>

<button
className="btn"
onClick={scanMarket}
style={{marginTop:10}}
>

{loading ? "Scanning Market..." : "Scan Opportunity"}

</button>

</div>

{result && (

<div style={{marginTop:20}}>

<div>
<b>Risk Level:</b> {result.risk_level}
</div>

<div>
<b>Recommended Incoterm:</b> {result.recommended_incoterm}
</div>

<div>
<b>Export Stage:</b> {result.journey_stage}
</div>

</div>

)}

</div>

)

}