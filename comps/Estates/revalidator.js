'use server'
import { revalidateTag } from 'next/cache'

export default async function revalidator() { 
    revalidateTag('estates')
    revalidateTag('items')
    revalidateTag('seed')
    revalidateTag('item')
}
