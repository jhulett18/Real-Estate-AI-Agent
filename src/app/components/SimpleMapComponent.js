import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

const customIcon = new L.Icon({
  iconUrl: "/location-pin.svg", // path from `public` folder
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const properties = [
  { id: 1, image: "/daytona-international-speedway.jpg", name: "Daytona International Speedway", lat: 29.191138, lng: -81.069830 },
  { id: 2, image: "/PSL-Botanical-Garden.jpg", name: "Port St. Lucie Botanical Gardens", lat: 27.269907, lng: -80.319781 },
];


const SimpleMapComponent = () => {
  console.log("🚨 Map component rendered");
  return (
    
    <MapContainer 
      center={[26, -80.4194]} 
      zoom={5} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={true}
      attributionControl={true}
    >
     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {properties.map((prop) => (
          <Marker icon={customIcon} key={prop.id} position={[prop.lat, prop.lng]}>
            <Popup>
              <div className="w-48">
                <Image src={prop.image} width="100" height="100" className="w-full h-auto rounded mb-2" />
                <h3 className="text-sm font-semibold">{prop.name}</h3>
                <p className="text-xs text-gray-600">Description or extra info here</p>
              </div>
            </Popup>
          </Marker>
          ))}
    </MapContainer>
  );
};

export default SimpleMapComponent;