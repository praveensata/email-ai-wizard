
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getCampaigns } from '@/services/campaignService';
import { Campaign, CampaignStatus } from '@/types/campaign';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  BarChart4 as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Loader2 
} from 'lucide-react';

const Analytics = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (currentUser?.uid) {
          const campaignData = await getCampaigns(currentUser.uid);
          setCampaigns(campaignData as Campaign[]);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load campaign data for analytics",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentUser, toast]);

  // Mock data for visualization purposes
  const campaignPerformanceData = [
    { name: 'New Year Sale', opened: 68, clicked: 42, unsubscribed: 2 },
    { name: 'Valentine Special', opened: 72, clicked: 48, unsubscribed: 1 },
    { name: 'Spring Collection', opened: 65, clicked: 35, unsubscribed: 3 },
    { name: 'Summer Discount', opened: 78, clicked: 52, unsubscribed: 2 },
    { name: 'Back to School', opened: 82, clicked: 56, unsubscribed: 1 },
  ];

  const openRateData = [
    { name: 'Week 1', rate: 42 },
    { name: 'Week 2', rate: 48 },
    { name: 'Week 3', rate: 52 },
    { name: 'Week 4', rate: 58 },
    { name: 'Week 5', rate: 62 },
    { name: 'Week 6', rate: 60 },
    { name: 'Week 7', rate: 65 },
    { name: 'Week 8', rate: 68 },
  ];

  const clickRateData = [
    { name: 'Week 1', rate: 18 },
    { name: 'Week 2', rate: 22 },
    { name: 'Week 3', rate: 28 },
    { name: 'Week 4', rate: 32 },
    { name: 'Week 5', rate: 38 },
    { name: 'Week 6', rate: 35 },
    { name: 'Week 7', rate: 42 },
    { name: 'Week 8', rate: 45 },
  ];

  const segmentPerformanceData = [
    { name: 'All Customers', value: 35 },
    { name: 'New Customers', value: 45 },
    { name: 'Returning', value: 55 },
    { name: 'Inactive', value: 20 },
    { name: 'High Value', value: 65 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 5 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
  const DEVICE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

  // Calculate campaign stats
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(campaign => campaign.status === CampaignStatus.Sent).length;
  const averageOpenRate = 48; // Mock data - in a real app you'd calculate from actual stats
  const averageClickRate = 32; // Mock data - in a real app you'd calculate from actual stats

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 text-marketing-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track and analyze your email marketing performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p className="text-3xl font-bold">{totalCampaigns}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Sent Campaigns</p>
                <p className="text-3xl font-bold">{sentCampaigns}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Average Open Rate</p>
                <p className="text-3xl font-bold">{averageOpenRate}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Average Click Rate</p>
                <p className="text-3xl font-bold">{averageClickRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Tabs */}
        <Tabs defaultValue="performance">
          <TabsList className="mb-6">
            <TabsTrigger value="performance" className="flex items-center">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Campaign Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Engagement Trends
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Audience Insights
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance Comparison</CardTitle>
                  <CardDescription>Compare open, click, and unsubscribe rates across campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={campaignPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="opened" name="Open Rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="clicked" name="Click Rate" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="unsubscribed" name="Unsubscribe Rate" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Rate Trend</CardTitle>
                  <CardDescription>Weekly open rate percentage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={openRateData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="rate" name="Open Rate %" stroke="#3B82F6" fill="#93c5fd" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Click Rate Trend</CardTitle>
                  <CardDescription>Weekly click rate percentage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={clickRateData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" name="Click Rate %" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Segment Performance</CardTitle>
                  <CardDescription>Open rates by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={segmentPerformanceData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Open Rate']} />
                        <Legend />
                        <Bar dataKey="value" name="Open Rate (%)" radius={[0, 4, 4, 0]}>
                          {segmentPerformanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>Email opens by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Opens']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
