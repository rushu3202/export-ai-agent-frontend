import { useState } from "react";

export default function MarketOpportunity() {

const [product, setProduct] = useState("");
const [markets, setMarkets] = useState([]);

const analyzeMarket = async () => {

const mockData = [
{
country: "USA",
importValue: "$230M",
tariff: "3%",
trend: "Growing"
},
{
country: "Germany",
importValue: "$110M",
tariff: "0%",
trend: "Stable"
},
{
country: "UK",
importValue: "$75M",
tariff: "0%",
trend: "Growing"
}
];

setMarkets(mockData);
};

return (

<div>

<div style={{display:"flex",gap:10}}>

<input
className="input"
placeholder="Enter product (turmeric, spices)"
value={product}
onChange={(e)=>setProduct(e.target.value)}
/>

<button className="btn" onClick={analyzeMarket}>
Analyze Markets
</button>

</div>

{markets.map((m,i)=>(
<div key={i} className="hsRow">

<b>{m.country}</b>

<div className="muted">
Import Volume: {m.importValue}
</div>

<div className="muted">
Tariff: {m.tariff}
</div>

<div className="muted">
Trend: {m.trend}
</div>

</div>
))}

</div>

);

}