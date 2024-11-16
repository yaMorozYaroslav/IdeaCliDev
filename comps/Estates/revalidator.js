'use server'
import { revalidateTag } from 'next/cache'

export default async function revalidator() { 
    revalidateTag('estates')
    revalidateTag('units')
    revalidateTag('estate')
    revalidateTag('unit')
}
