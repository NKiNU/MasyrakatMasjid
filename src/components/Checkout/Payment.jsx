import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bookingApi from "../../api/bookingApi";
import paymentApi from "../../api/paymentApi";

const PaymentGateway = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCancelling, setIsCancelling] = useState(false);
    const { orderId, amount, paymentType ,details } = location.state;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{
        console.log(details)
    })

    const handleConfirmPayment = async () => {
        // First, show confirmation dialog
        const result = await Swal.fire({
            title: 'Confirm Payment',
            text: `Are you sure you want to proceed with the payment of RM ${amount}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                
                // Show loading state
                Swal.fire({
                    title: 'Processing Payment',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Process payment
                const paymentResult = await paymentApi.processPayment({
                    orderId,
                    amount,
                    paymentType
                });

                // Close loading dialog
                Swal.close();

                // Show success message
                await Swal.fire({
                    title: 'Payment Successful!',
                    text: 'Your payment has been processed successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Continue'
                });

                navigate('/profile', { state: { orderId, paymentType }});

            } catch (err) {
                
                setError('Payment failed. Please try again.');
                console.error('Payment error:', err);
                
                // Show error message
                await Swal.fire({
                    title: 'Payment Failed',
                    text: 'There was an error processing your payment. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancelPayment = async () => {
        const result = await Swal.fire({
            title: 'Cancel Payment',
            text: 'Are you sure you want to cancel this payment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        });

        if (result.isConfirmed) {
            setIsCancelling(true);
            
            // Show cancelling message
            Swal.fire({
                title: 'Cancelling Payment',
                html: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                setIsCancelling(false);
                Swal.close();
                navigate(-2);
            }, 2000);
        }
    };

    return (
        <div className="payment-gateway bg-gray-100 p-6 rounded shadow-lg">
            <h1 className="text-2xl mb-4">Payment Gateway</h1>
            <p>You're transferring RM {amount} to Masyarakat Masjid</p>
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 disabled:opacity-50"
                >
                    Confirm Payment
                </button>
                <button
                    onClick={handleCancelPayment}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                    Cancel Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentGateway;