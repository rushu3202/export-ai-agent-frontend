import { useState } from "react"

export default function BuyerDiscoveryEngine() {

const [product,setProduct] = useState("")
const [country,setCountry] = useState("")
const [buyers,setBuyers] = useState(null)
const [loading,setLoading] = useState(false)

const findBuyers = async () => {

setLoading(true)

const res = await fetch("/api/find-buyers",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({product,country})
})

const data = await res.json()

setBuyers(data.buyers)

setLoading(false)

}

return (

<div>

<input
className="input"
placeholder="Product (example: banana powder)"
value={product}
onChange={(e)=>setProduct(e.target.value)}
/>

<input
className="input"
placeholder="Country (example: UK)"
value={country}
onChange={(e)=>setCountry(e.target.value)}
/>

<button
className="btn"
onClick={findBuyers}
>
Find Importers
</button>

{loading && <div className="muted">Searching buyers...</div>}

{buyers && (

<div style={{marginTop:20}}>

{buyers.map((b,i)=>(
<div key={i} className="hsRow">

<div className="hsText">

<b>{b.company}</b>

<div className="muted">
{b.country}
</div>

<div className="muted">
Type: {b.type}
</div>

<a href={b.website} target="_blank">
Visit Website
</a>

</div>

</div>
))}

</div>

)}

</div>

)

}
