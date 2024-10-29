'use server'
import { revalidateTag } from 'next/cache'

export default async function revalidator() { 
    revalidateTag('seeds')
    revalidateTag('items')
    revalidateTag('seed')
    revalidateTag('item')
}
