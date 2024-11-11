//~ 'use client'
import axios from 'axios'
//~ import { cookies } from 'next/headers'
//~ import {useCookies} from 'next-client-cookies'
import cookies from 'js-cookie';

const API = axios.create({baseURL:'https://hesen-properties-3eefa0d80ae7.herokuapp.com'})
//~ const API = axios.create({baseURL:'http://localhost:5000'})
//~ const API = axios.create({baseURL:'https://flora-storage-95930743be75.herokuapp.com'})
//~ const cooks = cookies().get('session').value

API.interceptors.request.use((req)=>{
    const session = cookies.get('session')
    console.log(session)
   
    if(session){
		 const parsedToken = JSON.parse(session).token
		 req.headers.Authorization = `Bearer ${parsedToken}`}
    //~ if(localStorage.getItem('profile')){
	//~ req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`  
    
    return req
})

export const getEstateUnits =(estateID, page)=> API.get(`/units/${estateID}`)
//~ export const getUnits =(category, type, page, search, sort)=> API.get(
     //~ `/items?category=${category}&type=${type}&page=${page}
                             //~ &search=${search}&sort=${sort}`)
export const getUnit = (unitID) => API.get(`/units/${id}`)
export const createUnit =(estateID, source)=> API.post(`/units/${estateID}`, source)
export const editUnit =(unitID, source)=>API.patch(`/units/${unitID}`, source)
export const deleteUnit =(unitID)=>API.delete(`/units/${unitID}`)

export const getEstates =(location = '', page)=> API.get(
     `/estates?location=${location}&page=${page}`)
export const getEstate =(id)=> API.get(`/estates/${id}`)
export const createEstate =(source)=> API.post('/estates', source)
export const editEstate =(id, source)=>API.patch(`/estates/${id}`, source)
export const deleteEstate =(id)=>API.delete(`/estates/${id}`)

export const auth =(source)=>API.post('/user/signin', source)
export const register =(source)=>API.post('/user/signup', source)
export const sendEmail =(source)=>API.post('/email', source)
