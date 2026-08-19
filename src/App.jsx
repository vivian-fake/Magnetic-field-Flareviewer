import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'
import { EllipseCurve, TextureLoader } from 'three'
import { useControls, button, Leva } from 'leva'
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Temporal } from '@js-temporal/polyfill'
import { Value } from 'three/examples/jsm/inspector/ui/Values.js'
import { update } from 'three/examples/jsm/libs/tween.module.js'
import { color } from 'three/tsl'
function formatdate(dt) {
  var yyyy = dt.year;
  var MM = dt.month;
  var dd = dt.day;
  var hh = dt.hour;
  var mm = dt.minute;
  var ss = dt.second;
 
  mm=Math.ceil(mm / 15) * 15;
  if(mm== 60){
    mm="00";
    hh= hh + 1;

  }
  else if(mm <= 9){
    mm= '0' + mm;
  }
  if(hh== 24){
    hh='00';
    dd= dd+1;
  }
  else if (hh  <= 9){
    hh= '0' + hh; 
  }
  if (MM  <= 9){
    MM= '0' + MM; 
  }
  if (dd  <= 9){
    dd= '0' + dd; 
  }

  return yyyy +"/"+ MM +"/" + dd +"/" + yyyy + MM + dd +"_"+ hh + mm + ss;
}
function formatdatejson(dt) {
  var yyyy = dt.year;
  var MM = dt.month;
  var dd = dt.day;
  var hh = dt.hour;
  var mm = dt.minute;
  var ss = dt.second;
  if (MM  <= 9){
    MM= '0' + MM; 
  }
  if (dd  <= 9){
    dd= '0' + dd; 
  }

  return yyyy +"-"+ MM +"-" + dd +"&endDate=" + "yyyy" +"-"+ "MM" +"-"+ "dd";
}
function degrees_to_radians(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}
function calculate_cords(lon, lat, radius){

    const latRad = degrees_to_radians(lat);
    const lonRad = degrees_to_radians(lon);
        
    var x = ((radius) * Math.cos(latRad) * Math.cos(lonRad));
    var y = ((radius) * Math.cos(latRad) * Math.sin(lonRad));
    var z = ((radius) * Math.sin(latRad));
    return(
      [x,y,z]
    );
}
function getlatlon(coords){
  var result = coords.includes("N");
  if (result){
   var x= coords.split("N");
	}
  var result = coords.includes("S");
  if (result){
    var x= coords.split("S");
    x[1]="-"+x[1];
	}
  var result = coords.includes("E");
  if (result){
    return (x[1].split("E"))
	}
  var result = coords.includes("W");
  if (result){
    var x= x[1].split("W");
    x[1] = "-" + x[1];
    return (x)
	}
}
// Async function to fetch JSON
async function fetchJsonFromUrl(url) {
  try {
    // Step 1: Fetch the URL
    const response = await fetch(url);
 
    // Check if the request was successful (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
 
    // Step 2: Convert response to JavaScript object
    const jsonData = await response.json();
 
    // Use the data
    // console.log(jsonData[0].sourceLocation);
    return(jsonData);
 
  } catch (error) {
    // Step 3: Handle errors
    console.error("Error fetching JSON:", error.message);
  }
}

var image = new Image();
const canvas =  document.createElement("canvas");
var context = canvas.getContext("2d");
var data = {};
function initcrop(url){
// load the image:

image.onload = function () {
  canvas.width = this.width;
  canvas.height = this.height;

  context.drawImage(this, 0, 0, image.width, image.height);

  cropImage();
};

image.src = url;
    return(canvas.toDataURL('image/png'))
}
    // crop image whitespace:
function cropImage() {
        data = context.getImageData(0, 0, image.width, image.height).data;

        var top    = scanY(true);
        var bottom = scanY(false);
        var left   = scanX(true);
        var right  = scanX(false);
        var new_width = right - left;
        var new_height = bottom - top;

        canvas.width = new_width;
        canvas.height = new_height;
        context.drawImage(image, left, top, new_width, new_height, 0, 0, new_width, new_height);
}

    // check if pixel is a color other than white:
function isColor(rgb) {
        return rgb.red <= 80 && rgb.green <= 80 && rgb.blue <= 80;
}
    // scan left and right edges of image:
function scanX(left) {
        var offset = (left) ? 1 : -1;

        for (var x = ((left) ? 0 : image.width - 1); ((left) ? (x < image.width) : (x > -1)); x += offset) {
            for (var y = 0; y < image.height; y++) {
                if (!isColor(getColor(canvas,x, y))) {
                    return x;
                }
            }
        }

        return null;
}
function getColor(canvas, x, y) {    
        var context = canvas.getContext("2d");
        var pixel = context.getImageData(x, y, 1, 1);

        // Red = rgb[0], green = rgb[1], blue = rgb[2]
        // All colors are within range [0, 255]
        var rgb = pixel.data;

        return{
            red: rgb[0],
            green: rgb[1],
            blue:  rgb[2]
        };
}
    // scan top and bottom edges of image:
function scanY(top) {
        
        var offset = (top) ? 1 : -1;

        for (var y = ((top) ? 0 : 995 - 1); ((top) ? (y < image.height) : (y > -1)); y += offset) {
            for (var x = 0; x < image.width; x++) {
                if (!isColor(getColor(canvas,x, y))) {
                    return y;
                }
            }
        }

        return null;
}
const response = await fetch("./FLRDATA.json");
const jsonData = await response.json();
var listnum=0;

const levatheme={
  space:{
    rowgap:'20px',
    md:'8px',
    sm:'10px',
    colgap:'2px'
  },
  sizes:{
    rootWidth:'25%',
  },
}
function showhelp(){
  var x = document.getElementById("info");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
function App() {
  const levaHelp = useControls({"Help": button(() => showhelp()),});
  var [{ flareID }, set] = useControls(() => ({ flareID:{ value:'2026-04-01T13:38:00-FLR-001', onChange: (v) => {}, transient: false} }));
  function cycle(direct){
  if (direct=="next"){
    listnum=listnum+1;
    set({ flareID: String(jsonData[listnum].flrID) })
    // console.log("this is working though" + flareID);
  }
  if (direct=="back"){
    listnum=listnum-1;
    set({ flareID: String(jsonData[listnum].flrID) })
    // console.log("this is working though" + flareID);
  }}
  const levaConfig = useControls({"next": button(() => cycle('next')),});
  const levaConfig2 = useControls({"previous": button(() => cycle('back')),});
  for (var i = 0; i < jsonData.length; i++){
    if(jsonData[i].flrID == flareID){
      console.log("its:" + i)
      listnum= i
    }
  }
  // const { location } = useControls({ location: 'S0E0'});
  const location = String(jsonData[listnum].sourceLocation);
  const locationprev = String(jsonData[listnum-1].sourceLocation);
  const { displacementscale } = useControls({ displacementscale: '0.1'});
  const {showpreviousactiveregion}= useControls({showpreviousactiveregion: false})
  if(showpreviousactiveregion){
    var prevopacity=0.25;
  }
  else{
    var prevopacity=0;
  }
  var latlon=getlatlon(location);
  var latlonprev=getlatlon(locationprev);
  // const { time } = useControls({time:'2026-02-14 20:15:00+00:00'});
  const basetime=jsonData[listnum].beginTime
  const time = String(basetime.replace("Z", "+00:00"));
  var DT=Temporal.PlainDateTime.from(time);
  var urltime=formatdate(DT);
  const limittime= Temporal.PlainDateTime.from('2016-01-01T01:00')
  if(Temporal.PlainDateTime.compare(DT, limittime) == -1){
    var sunmap= useLoader(TextureLoader, './empt.png');
  }
  else{
    var croptex=initcrop('/browse/'+urltime+'0_1024_HMIB.jpg');
    var sunmap = useLoader(TextureLoader, croptex);
    
    console.log("image updated")
  }
  const { nodes, materials } = useGLTF('/halfspherereuved.glb');
  return (
    <>
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <mesh position={calculate_cords(Number(latlon[0]),Number(latlon[1]),1)} scale={0.1}>
        <sphereGeometry args={[1,10,12]}/>
        <meshStandardMaterial color={'orange'} opacity={0.25} transparent/>
      </mesh>
      <mesh position={calculate_cords(Number(latlonprev[0]),Number(latlonprev[1]),1)} scale={0.1}>
        <sphereGeometry args={[1,10,12]}/>
        <meshStandardMaterial color={'yellow'} opacity={prevopacity} transparent/>
      </mesh>
        <mesh geometry={nodes.sun.geometry} rotation={[3.14,0,0]}>
          <canvasTexture/>
          <meshStandardMaterial displacementMap={sunmap} displacementScale={Number(displacementscale)} map={sunmap}/>
        </mesh>
      <OrbitControls />

    </Canvas>
    <Leva oneLineLabels flat titleBar={false} theme={ levatheme }/>
    
      <div id='info'>
        <h1>About Flareviewer</h1>
        <p>This website was made to display solar flares and magnetic field data. The half sphere shown represents the half of the sun that is visiable from earth during the timeframe specified. The bumps on the surface represent the magnetic field values taken from SDO magneteogram images, the raised parts are strong with a postive polarity and the lowered parts are a strong negative polarity. The orange sphere shows the active region of the selected solar flare. For a more in-depth explaination you can watch my presentation of the project this website was made for,</p>
        <a href='https://n3.sonoma.edu/internship/projects/2026/'>presentation found at the bottom of this page</a>
        <p>images may take time to load so if the image isnt updating click one of the controls to cause it to reload</p>
        <p>controls: the side menu allows you to edit the 3D model. The flare ID box displays the flare currently being viewed, this ID contains the date of the event. The ID's are the ones assigned within the DONKI database. If you dont want to search for direct ID's you can use the next and back buttons to cycle to the flare before or after the one you have currently selected. Displacement scale will change the intensity of the bumps on the sphere, click and drag the box to change it or type a value. Checking the box show previous active region will show a yellow sphere where the previous flare's active region was.</p>
        <p>click the help button to open and close this menu</p>
        <br></br>
        <h2>webpage made by Vivian Eagar</h2>
        <h2>flare data sourced from DONKI, images sourced from SDO</h2>
      </div>
    
    </>
  )
}

export default App
