'use client'

import React from 'react'
import * as S from './check-out.styled'
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js'

import {useRouter, usePathname} from 'next/navigation'
import {useTranslations} from 'next-intl'

import {useCartContext} from '../../context/cart/CartState'
import {SpinZone} from '../../blocks/SpinZone'

export const CheckOut = ({amount}: {amount: number}) => {
//~ export const CheckOut = () => {
	const {cartTotal, clearCart} = useCartContext()
	
	const stripe = useStripe();
	const elements = useElements();
	
	const [errorMessage, setErrorMessage] = React.useState<string>();
	const [clientSecret, setClientSecret] = React.useState('')
	const [loading, setLoading] = React.useState(false)
	
	const t = useTranslations('List')
	
	//~ console.log(amount)
	const {push} = useRouter()
	const router = typeof window !== "undefined"?window.location.host:undefined
	//~ console.log(router)
		            
	
	React.useEffect(()=>{
		fetch(`/api/create-payment-intent`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ amount: amount})
			})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret))
		}, [amount]);
	const handleSubmit = async(event : React.FormEvent<HTMLFormElement>) => {
		                       event.preventDefault();
		                       setLoading(true)
		                       alert(`Cool, you paid ${cartTotal}UAH!`)	
    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
     const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        //~ return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
        return_url: `https://${router}`
      },
    }).then()
    //~ }).then(result => {if(result.error){alert(error.message)}else{
		                  //~ console.log(result);alert('text')}} );
    if (!error) {
	// nothing
    } else {
            alert(error.message)
            setErrorMessage(error.message)}
        setLoading(false);
  };
  if (!clientSecret || !stripe || !elements) {return <button>loading</button>}
		                       	
	return (<><form onSubmit={handleSubmit}>

	         {clientSecret && <S.Container>
				                     <PaymentElement />
				              </S.Container>}
	         {errorMessage && <div>{errorMessage}</div>}
	         <button style={{marginTop: '120px'}}>
	           {!loading ? `Pay $${amount / 100} (${cartTotal}₴) ` : "Processing..."}
	         </button>	
		    </form>
		    <SpinZone><S.RealLink href={'/'}>
                                  {t('menu')}</S.RealLink></SpinZone></>) 
	}
	
