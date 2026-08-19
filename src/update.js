// im just going to convert to javascript because it makes things easier ok

const response = await fetch("FLRDATA.json");
const jsonData = await response.json();
        
const basetime= jsonData[jsonData.length - 1].submissionTime;
console.log("last updated: " + basetime);
const time = String(basetime.replace("Z", "+00:00"));
var DT=Temporal.PlainDateTime.from(time);
function formatdate(dt) {
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
  if (hh  <= 9){
    hh= '0' + hh; 
  }
  mm=Math.ceil(mm / 15) * 15;

  return yyyy +"-"+ MM +"-" + dd;
}
var urltime=formatdate(DT);
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
var currentjson= await fetchJsonFromUrl("/FLR?startDate="+ urltime);

const cbasetime= currentjson[currentjson.length - 1].submissionTime;
const ctime = String(cbasetime.replace("Z", "+00:00"));
var DT2=Temporal.PlainDateTime.from(time);
if(Temporal.PlainDateTime.compare(DT, DT2)){
    var x='adding most recent data';
    const toadd=currentjson[Temporal.PlainDateTime.from(curentdf['submissionTime']) > DT];
    updateddf= jsonData.push(toadd);
    console.log(updateddf);
    fs.writeFile('FLRDATA.json', json, 'utf8', function(err){
            if(err){ 
                  console.log(err); 
            } else {
                  //Everything went OK!
            }});
}
else{
    var x='up to date'
}
console.log(x)