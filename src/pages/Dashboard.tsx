
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCampaigns } from '@/services/campaignService';
import { Campaign, CampaignStatus } from '@/types/campaign';
import { AreaChart, BarChart, Clock, Mail, Plus, Send, Users } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
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
          description: "Failed to load campaign data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentUser, toast]);

  // For demo purposes: Campaign performance data
  const campaignPerformanceData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 58 },
    { name: 'Wed', value: 72 },
    { name: 'Thu', value: 65 },
    { name: 'Fri', value: 80 },
    { name: 'Sat', value: 40 },
    { name: 'Sun', value: 35 },
  ];

  // For demo purposes: Email engagement data
  const engagementData = [
    { name: 'Opened', value: 60 },
    { name: 'Clicked', value: 25 },
    { name: 'Unsubscribed', value: 5 },
    { name: 'Bounced', value: 10 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

  // Summary stats
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(campaign => campaign.status === CampaignStatus.Sent).length;
  const draftCampaigns = campaigns.filter(campaign => campaign.status === CampaignStatus.Draft).length;
  const scheduledCampaigns = campaigns.filter(campaign => campaign.status === CampaignStatus.Scheduled).length;

  // Recent campaigns
  const recentCampaigns = [...campaigns]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back to your email marketing command center</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/campaigns/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold">{totalCampaigns}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sent</p>
                <p className="text-2xl font-bold">{sentCampaigns}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold">{scheduledCampaigns}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recipients</p>
                <p className="text-2xl font-bold">5,247</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-marketing-blue-600" />
                Weekly Campaign Performance
              </CardTitle>
              <CardDescription>Email open rates for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={campaignPerformanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AreaChart className="h-5 w-5 mr-2 text-marketing-blue-600" />
                Email Engagement
              </CardTitle>
              <CardDescription>Distribution of email engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your most recently created email campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading campaigns...</div>
            ) : recentCampaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Campaign Name</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Segment</th>
                      <th className="text-right py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b">
                        <td className="py-3 px-4">{campaign.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${campaign.status === CampaignStatus.Sent ? 'bg-green-100 text-green-700' : 
                              campaign.status === CampaignStatus.Scheduled ? 'bg-yellow-100 text-yellow-700' : 
                              campaign.status === CampaignStatus.Draft ? 'bg-gray-100 text-gray-700' : 
                              'bg-red-100 text-red-700'}`}
                          >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {campaign.createdAt && new Date(campaign.createdAt.seconds * 1000).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {campaign.customerSegment.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link to={`/campaigns/${campaign.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any campaigns yet</p>
                <Link to="/campaigns/new">
                  <Button>Create Your First Campaign</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
