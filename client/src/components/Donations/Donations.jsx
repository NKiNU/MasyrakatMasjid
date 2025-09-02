import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonationModal from './DonateModal';
import { useAuth } from '../../context/AuthContext';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('title'); // Default sort by title
    const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

    useEffect(() => {
        axios.get('http://localhost:3001/api/donations')
            .then(response => setDonations(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDonationSuccess = () => {
        // Refresh donations after a successful transaction
        axios.get('http://localhost:3001/api/donations')
            .then(response => setDonations(response.data))
            .catch(error => console.error(error));
    };

    // Filter and search donations
    const filteredDonations = donations
        .filter(donation =>
            donation.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const keyA = a[sortKey];
            const keyB = b[sortKey];
            if (sortOrder === 'asc') {
                return keyA > keyB ? 1 : -1;
            }
            return keyA < keyB ? 1 : -1;
        });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDonations = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4">Donate To Masjid</h1>

            {/* Search */}
            {/* <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
                />
            </div> */}

            {/* Table */}
            <div className='h-6'></div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th
                            className="px-6 py-3 cursor-pointer"
                            onClick={() => {
                                setSortKey('title');
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Title {sortKey === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="px-6 py-3 cursor-pointer"
                            onClick={() => {
                                setSortKey('targetAmount');
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Target Amount {sortKey === 'targetAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="px-6 py-3 cursor-pointer"
                            onClick={() => {
                                setSortKey('currentAmount');
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Current Amount {sortKey === 'currentAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentDonations.map((donation) => (
                        <tr
                            key={donation._id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {donation.title}
                            </td>
                            <td className="px-6 py-4">RM {donation.targetAmount.toLocaleString()}</td>
                            <td className="px-6 py-4">RM {donation.currentAmount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                {donation.currentAmount >= donation.targetAmount ? (
                                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                        Completed
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                                        Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
    <button
        onClick={() => setSelectedDonation(donation._id)}
        disabled={donation.currentAmount >= donation.targetAmount}
        className={`font-medium ${
            donation.currentAmount >= donation.targetAmount
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 dark:text-blue-500 hover:underline'
        }`}
    >
        Donate
    </button>
</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Modal */}
            {selectedDonation && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <DonationModal
                        donationId={selectedDonation}
                        onClose={() => setSelectedDonation(null)}
                        onSuccess={handleDonationSuccess}
                    />
                </div>
            )}
        </div>
    );
};

export default DonationList;
