'use client'
import {CheckOut} from '../../../comps/CheckOut/CheckOut.tsx'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import {useCartContext} from '../../../context/cart/CartState'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)


export default function Payment(){


const {cartItems, cartTotal, clearCart} = useCartContext()

function convertToSubcurrency(amount, factor = 100){
	                const converted = amount / 41
		            return Math.round(converted * factor)}
		            
return (<><Elements stripe={stripePromise}
	              options={{
						  mode: 'payment',
						  amount: convertToSubcurrency(cartTotal),
						  currency: 'usd'}}>
	       <CheckOut amount={convertToSubcurrency(cartTotal)}/>
	    </Elements></>
	        )}
