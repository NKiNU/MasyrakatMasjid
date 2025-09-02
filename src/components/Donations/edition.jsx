import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminDashboard = () => {
  // ... existing state management code ...

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Donations Dashboard</h1>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  variant="outline"
                  size="icon"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Donation
                </Button>
              </div>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalCampaigns}</div>
                  <p className="text-xs text-gray-500">Active donation campaigns</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Collected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    ${totalCollected.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Current donations received</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Target Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${overallTargeted.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Total campaign goals</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Donation Progress</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {selectedDonation === 'overall' ? 'All Donations' : selectedDonation}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedDonation('overall')}>
                      All Donations
                    </DropdownMenuItem>
                    {donations.map((donation) => (
                      <DropdownMenuItem 
                        key={donation._id}
                        onClick={() => setSelectedDonation(donation.title)}
                      >
                        {donation.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="h-[300px]">
                <Line data={lineChartData} options={{ ...lineChartOptions, maintainAspectRatio: false }} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Overview</h3>
              <div className="h-[300px]">
                <Bar data={barChartData} options={{ ...barChartOptions, maintainAspectRatio: false }} />
              </div>
            </Card>
          </div>

          {/* Donations Table */}
          <Card>
            <div className="rounded-md border">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Campaign</th>
                      <th className="px-6 py-3 text-right">Target</th>
                      <th className="px-6 py-3 text-right">Current</th>
                      <th className="px-6 py-3 text-right">Progress</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation) => {
                      const progress = (donation.currentAmount / donation.targetAmount) * 100;
                      return (
                        <tr key={donation._id} className="bg-white hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {donation.title}
                          </td>
                          <td className="px-6 py-4 text-right">
                            ${donation.targetAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            ${donation.currentAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDonation(donation._id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editDonation(donation)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(donation._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Keep existing modals... */}
    </div>
  );
};

export default AdminDashboard;