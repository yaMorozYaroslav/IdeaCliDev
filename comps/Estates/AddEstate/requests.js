import React from 'react'
import {uploadImage} from './convert-base64'

const base = 'https://geogratis.gc.ca/services/geoname/en/geonames.json'
 
const initialSource =   {provName: '', provCode:'', location:'',
	                     main: '', bath:'', live: '',
	                     kitch: '', park: '' }
	                     
const initialLabels =   {main: 'no file', bath:'no file',
		                 live: 'no file',
		                 kitch: 'no file', park: 'no file'}
                   
   export function requests(){
	   
const [source, setSource] = React.useState(initialSource)
const [labels, setLabels] = React.useState(initialLabels)
const [locations, setLocations] = React.useState([])

 //~ async function getProvinces() {
      //~ let allData = await fetch(`${base}?concise=PROV`, )
                                                   //~ .then((res) => res.json())
      //~ let provinceData = allData.items.map(({name, province}) => 
                                          //~ ({name: name, code: province.code}))
      //~ setSelected({...selected, provinces: provinceData})                              
            //~ }
 //~ async function getLocations(e){
	  //~ e.preventDefault()
	  //~ let targetValues = JSON.parse(event.target.value)
	  //~ let allData = await fetch(`${base}?province=${targetValues.code}`, )
                                                   //~ .then((res) => res.json())
                                         
      //~ let locationData = allData.items.map(item => ({label:item.name, id:item.id}))
      //~ setSelected({...selected, locations: locationData})
           //~ setSource({...source, provName: targetValues.name,
			                     //~ provCode: targetValues.code})
	  //~ }  
	  
 //~ async function searchLocations(e, provCode){
	  //~ e.preventDefault()
	  
	   //~ let allData = await fetch(
	        //~ `${base}?province=${provCode}&q=${e.target.value}`, )
                                                   //~ .then((res) => res.json())
       
	   //~ let locationData = allData.items.map(item => ({label:item.name, 
		                                              //~ id:item.id})) 
	   //~ let targetValue = e.target.value
	                  
	   //~ setSelected({...selected, locations: locationData})
	   //~ setSource({...source, location: targetValue})
	   //~ }
 async function searchLocations(e){
	
	  let allData = await fetch(
 `https://geogratis.gc.ca/services/geolocation/en/locate?q=${e.target.value}`,)
	                                               .then((res) => res.json())
	      //~ console.log(allData)
	   let targetValue = e.target.value
	   let locationData = allData.map(item => ({label: item.title, 
		                                      id: item.geometry.coordinates[0]
		                                         *item.geometry.coordinates[1]}))
	   console.log(locationData)
	   setLocations(locationData)
	   setSource({...source, location: targetValue})
		
		//~ console.log(streetData.filter(element => 
		                          //~ element.label.includes("Dartmouth")))
	}
 const onImage = async(e) => {
    const {base64, file, sizeInKb} = await uploadImage(e)
    console.log(sizeInKb)
    setSource({...source, [e.target.id]: base64})
    setLabels({...labels, [e.target.id]: file.name})
		}
return {source, setSource, labels, locations,
	    searchLocations, onImage}
}
