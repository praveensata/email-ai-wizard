import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Campaign, CampaignStatus } from '@/types/campaign';
import { getCampaigns, deleteCampaign } from '@/services/campaignService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  FileEdit, 
  Loader2, 
  MailPlus, 
  Search, 
  Trash2,
  Eye
} from 'lucide-react';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (currentUser?.uid) {
          const campaignData = await getCampaigns(currentUser.uid);
          setCampaigns(campaignData as Campaign[]);
          setFilteredCampaigns(campaignData as Campaign[]);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load campaigns",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentUser, toast]);

  useEffect(() => {
    filterCampaigns();
  }, [searchTerm, statusFilter, campaigns]);

  const filterCampaigns = () => {
    let results = [...campaigns];
    
    if (searchTerm) {
      results = results.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(campaign => campaign.status === statusFilter);
    }
    
    setFilteredCampaigns(results);
  };

  const handleDelete = async (campaignId: string) => {
    setDeletingId(campaignId);
    try {
      await deleteCampaign(campaignId);
      
      setCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign.id !== campaignId));
      
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Failed to delete the campaign",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Email Campaigns</h1>
            <p className="text-gray-600">Manage your email marketing campaigns</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/campaigns/new">
              <Button>
                <MailPlus className="mr-2 h-4 w-4" /> Create Campaign
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={CampaignStatus.Draft}>Draft</SelectItem>
                <SelectItem value={CampaignStatus.Scheduled}>Scheduled</SelectItem>
                <SelectItem value={CampaignStatus.Sent}>Sent</SelectItem>
                <SelectItem value={CampaignStatus.Failed}>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>
              {filteredCampaigns.length} 
              {filteredCampaigns.length === 1 ? ' campaign' : ' campaigns'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-marketing-blue-500 animate-spin" />
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Campaign</th>
                      <th className="text-left py-3 px-4 font-medium">Subject</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Scheduled</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{campaign.name}</td>
                        <td className="py-3 px-4">{campaign.subject}</td>
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
                        <td className="py-3 px-4">{formatDate(campaign.createdAt)}</td>
                        <td className="py-3 px-4">
                          {campaign.scheduledDate ? formatDate(campaign.scheduledDate) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/campaigns/${campaign.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/campaigns/edit/${campaign.id}`}>
                              <Button variant="ghost" size="sm">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {deletingId === campaign.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{campaign.name}"? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(campaign.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No campaigns found</p>
                {searchTerm || statusFilter !== 'all' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link to="/campaigns/new">
                    <Button>Create Your First Campaign</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {filteredCampaigns.length > 0 && (
              <div className="text-sm text-gray-500 w-full text-center">
                Showing {filteredCampaigns.length} of {campaigns.length} campaigns
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CampaignsList;
