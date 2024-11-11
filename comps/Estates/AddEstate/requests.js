const base = 'https://geogratis.gc.ca/services/geoname/en/geonames.json'
  

export async function getProvinces() {
      let allData = await fetch(`${base}?concise=PROV`, )
                                                   .then((res) => res.json())
      let provinceData = allData.items.map(({name, province}) => 
                                          ({name: name, code: province.code}))
            return {provinceData}                              
            }
export async function getLocations(e){
	  e.preventDefault()
	  let targetValues = JSON.parse(event.target.value)
	  let allData = await fetch(`${base}?province=${targetValues.code}`, )
                                                   .then((res) => res.json())
                                         
      let locationData = allData.items.map(item => ({label:item.name, id:item.id}))
      console.log(targetValues)
      return {locationData, targetValues}
	  }  
	  
export async function searchLocations(e, provCode){
	  e.preventDefault()
	  
	   let allData = await fetch(
	        `${base}?province=${provCode}&q=${event.target.value}`, )
                                                   .then((res) => res.json())
       
	   let locationData = allData.items.map(item => ({label:item.name, 
		                                              id:item.id})) 
	   let targetValue = e.target.value
	   //~ setSelected({...selected, locations: locationData})
	   //~ setSource({...source, location: e.target.value})                
	   return {locationData, targetValue}
	   }
