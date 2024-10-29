import axios from 'axios'

const API = axios.create({baseURL:'https://new-flora-7e8f21fd2b9f.herokuapp.com'})
//~ const API = axios.create({baseURL:'https://flora-storage-95930743be75.herokuapp.com'})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
   req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req
})

export const getItems =(category, type, page, search, sort)=> API.get(
     `/items?category=${category}&type=${type}&page=${page}
                             &search=${search}&sort=${sort}`)
export const createItem =(source)=> API.post('/items', source)
export const editItem =(id, source)=>API.patch(`/items/${id}`, source)
export const deleteItem =(id)=>API.delete(`/items/${id}`)

export const getSeeds =(category, type, page, search, sort)=> API.get(
     `/seeds?category=${category}&type=${type}&page=${page}
                             &search=${search}&sort=${sort}`)
export const createSeed =(source)=> API.post('/seeds', source)
export const editSeed =(id, source)=>API.patch(`/seeds/${id}`, source)
export const deleteSeed =(id)=>API.delete(`/seeds/${id}`)

export const auth =(source)=>API.post('/user/signin', source)
export const register =(source)=>API.post('/user/signup', source)
export const sendEmail =(source)=>API.post('/email', source)
