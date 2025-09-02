
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/AuthContext';

import paymentApi from "../../api/paymentApi";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {currentUser} =useAuth();
    // At the top of your component:
const [paymentDetails, setPaymentDetails] = useState(location.state.paymentDetails);
const [addressErrors, setAddressErrors] = useState({});
    // New state for payment form
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [cardErrors, setCardErrors] = useState({});

    const validateCardDetails = () => {
        const newErrors = {};
        
        // Card Number validation
        if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Invalid card number (16 digits required)';
        }
        
        // Expiry Date validation
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!cardDetails.expiryDate || !expiryRegex.test(cardDetails.expiryDate)) {
            newErrors.expiryDate = 'Invalid expiry date (MM/YY format)';
        } else {
            const [month, year] = cardDetails.expiryDate.split('/');
            const currentDate = new Date();
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            if (expiryDate < currentDate) {
                newErrors.expiryDate = 'Card has expired';
            }
        }
        
        // CVV validation
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
            newErrors.cvv = 'Invalid CVV (3-4 digits)';
        }
        
        setCardErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCardDetailChange = (e) => {
        const { name, value } = e.target;
        
        // Special formatting for card number and expiry date
        let formattedValue = value;
        if (name === 'cardNumber') {
            // Remove non-digit characters and limit to 16 digits
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'expiryDate') {
            // Auto-format expiry date
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
            }
        } else if (name === 'cvv') {
            // Limit CVV to 3-4 digits
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }
        
        setCardDetails(prev => ({
            ...prev,
            [name]: formattedValue
        }));
        
        // Clear specific error when user starts typing
        if (cardErrors[name]) {
            setCardErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateAddress = () => {
        if (paymentType !== 'purchase') return true;
        
        const newErrors = {};
        const address = paymentDetails.deliveryAddress;
        
        if (!address.street || address.street.trim() === '') {
            newErrors.street = 'Street address is required';
        }
        if (!address.city || address.city.trim() === '') {
            newErrors.city = 'City is required';
        }
        if (!address.state || address.state.trim() === '') {
            newErrors.state = 'State is required';
        }
        if (!address.postalCode || address.postalCode.trim() === '') {
            newErrors.postalCode = 'Postal code is required';
        }
        
        setAddressErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Ensure we have the required state
    if (!location.state?.paymentType || !location.state?.paymentDetails) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        Invalid checkout session. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const { paymentType } = location.state;

    const calculateSubtotal = () => {
        switch (paymentType) {
            case 'purchase':
                return paymentDetails.products?.reduce(
                    (total, product) => total + product.price * product.quantity,
                    0
                ) || 0;
            case 'service':
                return paymentDetails.fee || 0;
            case 'donation':
                return paymentDetails.amount || 0;
            case 'class':
                return paymentDetails.amount || 0;
            default:
                return 0;
        }
    };

    const deliveryFee = paymentType === 'purchase' ? 7.21 : 0;
    const serviceFee = calculateServiceFee(paymentType, calculateSubtotal());
    const total = calculateSubtotal() + deliveryFee + serviceFee;

    const handleProceedToPayment = async () => {
        try {

            if (total > 0) {
                // If there's an amount to pay, validate card details
                const isCardValid = validateCardDetails();
                if (!isCardValid) return;
            }
            
            setLoading(true);
            setError('');
    
            // Create order record
            const orderData = {
                orderId: generateOrderId(),
                timestamp: new Date().toISOString(),
                paymentType,
                items: paymentType === 'purchase' ? paymentDetails.products : null,
                serviceDetails: paymentType === 'service' ? { ...paymentDetails.bookingDetails,name:paymentDetails.serviceName } : null,
                donationDetails: paymentType === 'donation' ? paymentDetails : null,
                classDetails: paymentType === 'class' ? paymentDetails : null, // Add this line
                subtotal: calculateSubtotal(),
                deliveryFee,
                serviceFee,
                total,
                status: 'pending',
                deliveryAddress: paymentType === 'purchase' ? paymentDetails.deliveryAddress : null,
                userId: currentUser?._id,
                paymentDetails,
            };
            console.log(paymentDetails)
            console.log("creating order data", orderData)
    
            const response = await paymentApi.createOrder(orderData);
            
            if (response.status === 'pending') {
                navigate('/payment-gateway', { 
                    state: { 
                        orderId: response.orderId,
                        amount: total,
                        paymentType,
                        details: paymentType === 'purchase' ? paymentDetails.products 
                              : paymentType === 'service' ? paymentDetails.bookingDetails 
                              : paymentType === 'donation' ? paymentDetails 
                              : paymentType === 'class' ? paymentDetails // Add this line
                              : null,
                    } 
                });
            } else {
                throw new Error('Failed to create order');
            }
        } catch (err) {
            setError('Unable to process your order. Please try again.');
            console.error('Checkout error:', err);
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">
            Checkout - {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
            
        </h1>
        

        {error && (
            <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {paymentType === 'purchase' && (
                <ProductList products={paymentDetails.products} />
            )}
            
            {paymentType === 'service' && (
                <ServiceDetails details={paymentDetails} />
            )}
            
            {paymentType === 'donation' && (
                <DonationDetails details={paymentDetails} />
            )}

            {paymentType === 'class' && (
                <ClassDetails details={paymentDetails} />
            )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
            <OrderSummary 
                subtotal={calculateSubtotal()}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                total={total}
                paymentType={paymentType}
            />

{total > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-gray-700">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails.cardNumber}
                                onChange={handleCardDetailChange}
                                className={`w-full p-3 border ${cardErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {cardErrors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">{cardErrors.cardNumber}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700">Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={cardDetails.expiryDate}
                                onChange={handleCardDetailChange}
                                className={`w-full p-3 border ${cardErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {cardErrors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{cardErrors.expiryDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700">CVV/CVC</label>
                            <input
                                type="text"
                                name="cvv"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={handleCardDetailChange}
                                className={`w-full p-3 border ${cardErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {cardErrors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{cardErrors.cvv}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={handleProceedToPayment}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </div>
    </div>
);

};

// Helper Components
const ProductList = ({ products }) => (
    <>
        {products.map((product, index) => (
            <div key={index} className="flex items-start border-b last:border-b-0 py-6 first:pt-0 last:pb-0">
                <img 
                    src={product.image || '/api/placeholder/80/100'} 
                    alt={product.name}
                    className="w-24 h-28 object-cover rounded-md"
                />
                <div className="flex-1 ml-6">
                    <h3 className="text-gray-900 font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 mt-1">Price: RM {product.price.toFixed(2)}</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-2xl font-bold text-orange-500">
                            RM {(product.price * product.quantity).toFixed(2)}
                        </p>
                        <div className="text-gray-600">
                            Quantity: {product.quantity}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </>
);

const ServiceDetails = ({ details }) => (
    <div className="py-4">
        <h3 className="text-xl font-semibold mb-4">{details.serviceName}</h3>
        <p className="text-gray-600">{details.description}</p>
        <p className="text-xl font-bold text-orange-500 mt-4">
            RM {details.fee.toFixed(2)}
        </p>
    </div>
);

const DonationDetails = ({ details }) => (
    <div className="py-4">
        <h3 className="text-xl font-semibold mb-4">{details.title}</h3>
        <p className="text-gray-600">{details.description}</p>
        <p className="text-xl font-bold text-orange-500 mt-4">
            RM {details.amount.toFixed(2)}
        </p>
    </div>
);

const ClassDetails = ({ details }) => (
    <div className="py-4">
        <h3 className="text-xl font-semibold mb-4">{details.description}</h3>
        {/* <p className="text-gray-600">{details.description}</p> */}
        <div className="mt-4 space-y-2">
            <p className="text-gray-600">
                <span className="font-medium">Start Date:</span> {new Date(details.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
                <span className="font-medium">Time:</span> {details.startTime}
            </p>
            <p className="text-gray-600">
                <span className="font-medium">Venue:</span> {details.venue === 'online' ? 'Online Class' : details.venue}
            </p>
        </div>
    </div>
);

const OrderSummary = ({ subtotal, deliveryFee, serviceFee, total, paymentType }) => (
    <div className="space-y-4 text-lg">
        <div className="flex justify-between text-gray-600">
            <span>{paymentType === 'purchase' ? 'Order Total' : 'Amount'}</span>
            <span>RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
            <span>Service Fee and Tax</span>
            <span>RM {serviceFee.toFixed(2)}</span>
        </div>
        {paymentType === 'purchase' && (
            <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>RM {deliveryFee.toFixed(2)}</span>
            </div>
        )}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
            <span>Total</span>
            <span>RM {total.toFixed(2)}</span>
        </div>
    </div>
);

const DeliveryAddressSection = ({ address, onChange, errors, setErrors }) => {


    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...address,
            [name]: value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
            <div className="space-y-3">
                <div>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={address.street || ''}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city || ''}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={address.state || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Postal Code"
                            value={address.postalCode || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.postalCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Utility functions
const calculateServiceFee = (paymentType, amount) => {
    // Implement your service fee calculation logic
    return 0.00;
};

const generateOrderId = () => {
    return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};

const getCurrentUserId = () => {
    // Implement based on your authentication system
    return null;
};


export default Checkout;