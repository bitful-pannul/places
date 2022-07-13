import React, { useEffect, useState } from 'react'
import Urbit from '@urbit/http-api'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import './App.css'

const App = () => {
  const [status, setStatus] = useState("")
  const [dummyPlaces, setDummyPlaces] = useState([{lat: 12.132, long: 31.123, desc: "first outpost hideout"}, {lat: 65, long: -54, desc: "arctic base?"}, {lat: 69, long: 42, desc: "pure memes"}])

  // if served directly by ship, unnecessary. for dev purposes 
  const connect = async () => {
    window.urbit = await Urbit.authenticate({
      ship: "nec",
      url: "localhost:8080",
      code: "ropnys-batwyd-nossyt-mapwet",
      verbose: true
    })
  }

  const getLocations = async () => {
    const path = '/places/all'
    return window.urbit.scry({
      app: "places",
      path: path,
    })
  }
  
  const addLocation = async () => {
    window.urbit.poke({
      app: "places",
      mark: "place",
      json: { lat:  69.42012345, long: 42.6942012, desc: "hey there I'm poke"},
      onSuccess: () => console.log('poke success'),
      onError: () => console.log('poke error')
    })
  }

  const addMarker = (e) => {
    console.log(e)    
  }

  const LocationFinderDummy = ({dummyPlaces, setDummyPlaces}) => {
    const map = useMapEvents({
        click(e) {
            console.log(e.latlng);
	    setDummyPlaces([...dummyPlaces, {lat: e.latlng.lat, long: e.latlng.lng, desc: "yo babe this is a new place!"}])
        },
    });
    return null;
  };

  useEffect(() => {
    window.urbit = new Urbit("")
    window.urbit.ship = window.ship;
    window.urbit.onOpen = () => setStatus("con");
    window.urbit.onRetry = () => setStatus("try");
    window.urbit.onError = (err) => setStatus("err");
    
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    connect()
  }, [])
 

  return (
    <>
      <div>
        hey there
      </div>
      <button onClick={getLocations}>scry me baby</button>
      <button onClick={addLocation}>poke me baby</button>
    <div className="leaflet-container">
    <MapContainer center={[40.5050, -100.09]} zoom={13} onClick={(e) => addMarker(e)} >
    <TileLayer
      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    />
    {/* names of places... turn on everywhere or not?*/}
    <TileLayer
      attribution='Stamen Design'
      url='https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}'
      subdomains='abcd'
      minZoom={6}
      maxZoom={20}
      ext='png'
    />

    {dummyPlaces?.map((place, i) => {
      const pos = [place.lat, place.long]
      return (
       <Marker position={pos}>
	 <Popup>
	   {`lat: ${place.lat} long: ${place.long} `} <br />
	   {place.desc}
	 </Popup>
       </Marker>
      )
    })}
    <LocationFinderDummy dummyPlaces={dummyPlaces} setDummyPlaces={setDummyPlaces}/>
    </MapContainer>
    </div>
    </>
  );
}

export default App;
