import React, { useEffect, useState } from 'react'
import Urbit from '@urbit/http-api'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet';
import redmarker from './red-marker.png';
import palm from './palm.png'
import './App.css'

const App = () => {
  const [status, setStatus] = useState("")
  const [potentialPlace, setPotentialPlace] = useState({})
  const [places, setPlaces] = useState([])

  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isHovering, setIsHovering] = useState(false);
  


  // if served directly by ship, unnecessary. for dev purposes 
  const connect = async () => {
    window.urbit = await Urbit.authenticate({
      ship: "zod",
      url: "localhost:8080",
      code: "lidlut-tabwed-pillex-ridrup",
      verbose: true
    })
  }

  const getLocations = async () => {
    const path = '/places/all'
    const res = await window.urbit.scry({
      app: "places",
      path: path,
    })
    console.log(res)

    const newPlaces = res?.places.map((place, i) => {
      return {lat: Number(place.lat.substring(1)), long: Number(place.long.substring(1)), desc: place.desc}
    })
    console.log('scried places: ', newPlaces)

    setPlaces(newPlaces)
  }

  const handleAddLocation = async () => {
    const latt = "~" + potentialPlace.lat
    const longg = "~" + potentialPlace.long
    
    // todo: add checkers & error messages if something goes wrong
    if (description.length < 3) {
      setInfoMessage("!warn, maybe you forgot your description?")
      return
    }

    await window.urbit.poke({
      app: "places",
      mark: "place",
      json: { lat: latt, long: longg, desc: description },
      onSuccess: () => handlePokeSuccess(potentialPlace.lat, potentialPlace.long, description),
      onError: () => setInfoMessage("something went wrong."),
    })
  }
  

  const LocationFinder = () => {
    const map = useMapEvents({
        click(e) {
            console.log(e.latlng);
            setPotentialPlace({lat: e.latlng.lat, long: e.latlng.lng})
            //addLocation(e.latlng.lat, e.latlng.lng)
	          //setPlaces([...places, {lat: e.latlng.lat, long: e.latlng.lng, desc: "yo babe this is a new place!"}])
        },
    });
    return null;
  };

  const setInfoMessage = (info) => {
    setError(info)
    setTimeout(() => setError(""), 5000)
  }

  const handlePokeSuccess = (lat, long, desc) => {
    setInfoMessage("poke succeeded!")
    const awaitingRefreshPlace = {lat, long, desc}
    setPlaces([...places, awaitingRefreshPlace])
    setDescription("")
  }


  const handleDescription = (e) => {
    e.preventDefault()
    setDescription(e.target.value)
  }

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  
  const customIcon = new Icon({iconUrl: redmarker, iconSize: [25, 25]})


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

    // commented out connect() for production build, if using locally, call connect() here

    connect()
    setTimeout(() => getLocations(), 750) // wait 0.75s before scrying, session.js cannot seem to quite keep up.
  }, [])

  const About = () => {
    return (
      <div style={{marginTop: '1rem'}}>
        <span>%places is heavily inspired by %rumors from ~paldev </span><br />
        <span>it uses its gossip.hoon library to pass along data from pals</span><br />
        <span>github.com</span><br />
        <span>~bitful-pannul</span>
      </div>
    )
  }


  return (
    <>
      <div className="info-part">
      <div className='top-bar'>
        <span>&nbsp;％ｐｌａｃｅｓ</span>
        {isHovering && <About />}
        <span>
          <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            ａｂｏｕｔ
          </div>
          <img src={palm} width="80px" height="80px"/>
        </span>
      </div>
      <div>
        <span>
          <label>𝚕𝚊𝚝𝚒𝚝𝚞𝚍𝚎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input placeholder='69.420123456' value={potentialPlace.lat} style={{width: '11rem'}}/>
        </span>
      </div>
      <div>
        <span>
          <label>𝚕𝚘𝚗𝚐𝚒𝚝𝚞𝚍𝚎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input placeholder='169.420123456' value={potentialPlace.long} style={{width: '11rem'}}/>
        </span>
      </div>
      <div>
        <label style={{verticalAlign: 'top'}}>𝚍𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗&nbsp;&nbsp;</label>
        <textarea onChange={handleDescription} placeholder='maybe a new conquest...'></textarea>
      </div>
      <div className='buttonz'>
      <span>
        <button onClick={handleAddLocation}>𝚊𝚍𝚍 𝚙𝚕𝚊𝚌𝚎!</button>
        </span>
      {error && <span style={{backgroundColor: '#ffe8e9'}}>{error}</span>}
      {'|'}
      </div>
      </div>
      
    <MapContainer className="map-container" center={[39.5050, 24.09]} zoom={6} >
    <TileLayer
      attribution='Tiles &copy; Esri &mdash; Source: i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, Urbit Satellite Society, IGN, IGP, UPR-EGP, the GIS User Community, ~bitful-pannul '
      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    />
    {/* names of places... turn on everywhere or not?*/}
    <TileLayer
      attribution='Stamen Design, <a href="www.google.com">Urbit Explorers Club</a>'
      url='https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}'
      subdomains='abcd'
      minZoom={6}
      maxZoom={20}
      ext='png'
    />

    {places?.map((place, i) => {
      const pos = [place.lat, place.long]
      return (
       <Marker position={pos} key={i+1}>
	      <Popup>
	      {`lat: ${place.lat} long: ${place.long} `} <br />
	      {place.desc}
	      </Popup>
       </Marker>
      )
    })}

    {/* {Object.keys(potentialPlace) !== 0 && ( */}
    
      <Marker icon={customIcon} position={[potentialPlace.lat || 39, potentialPlace.long || 24]} key={1}>
        <Popup>
          add your place here.
        </Popup>
      </Marker>
    
    <LocationFinder />
    </MapContainer>
    </>
  );
}

export default App;

