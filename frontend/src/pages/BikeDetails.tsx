import { useParams } from "react-router-dom";

import FleeC2Details from "../bike-pages/FleeC2Details";
import FleeB1Details from "../bike-pages/FleeB1Details";
import FleeB2Details from "../bike-pages/FleeB2Details";
import FleeB3Details from "../bike-pages/FleeB3Details";

export default function BikeDetails() {

const { id } = useParams();

if (id === "1") return <FleeC2Details />;
if (id === "2") return <FleeB1Details />;
if (id === "3") return <FleeB2Details />;
if (id === "4") return <FleeB3Details />;

return (
<div className="p-10 text-center">
Bike not found
</div>
);

}