import axios from 'axios'

const apiKey = process.env.NEXT_PUBLIC_API_KEY

const getRegions =(areaRef)=> axios.post(
                                 'https://api.novaposhta.ua/v2.0/json/',
                                    {
                            "apiKey": `${apiKey}`,
                            "modelName": "Address",
                            "calledMethod": "getSettlementCountryRegion",
                            "methodProperties": {
                              "AreaRef" : `${areaRef}`
                              //~ "dcaad5a7-4b33-11e4-ab6d-005056801329"
                                   }
                                     })
export async function regionsGet(currRef){
		  const regionsData = await getRegions(currRef)
		  const dataAll = regionsData.data.data
		                   return {dataAll};
	                   }

const getLocations =(regionRef)=> axios.post(
                                 'https://api.novaposhta.ua/v2.0/json/',
                                    {
							"apiKey": `${apiKey}`,
                            "modelName": "Address",
                            "calledMethod": "getSettlements",
                            "methodProperties": {
                              "RegionRef" : `${regionRef}`
								   }
								      })
export async function locationsGet(currRef){
	       const locationsData = await getLocations(currRef)
	       const dataAll = locationsData.data.data
	                          return {dataAll};
	                  }
const getOffices =(locatRef)=> axios.post(
                                 'https://api.novaposhta.ua/v2.0/json/',
                                    {
							"apiKey": `${apiKey}`,
                            "modelName": "Address",
                            "calledMethod": "getWarehouses",
                            "methodProperties": {
                              "SettlementRef" : `${locatRef}`
								   }
								      })
export async function officesGet(currRef){
	       const officesData = await getOffices(currRef)
	       const dataAll = officesData.data.data
	                        return {dataAll};
	                  }
