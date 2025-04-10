
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getCampaign } from '@/services/campaignService';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const ViewCampaign = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const campaignData = await getCampaign(id);
        setCampaign(campaignData as Campaign);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load campaign details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Button onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/campaigns')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-gray-600">
            Created on {formatDate(campaign.createdAt)}
            {campaign.scheduledDate && ` • Scheduled for ${formatDate(campaign.scheduledDate)}`}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Subject</h3>
                <p className="p-3 bg-gray-50 rounded-md border">{campaign.subject}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Content</h3>
                <div className="p-4 bg-gray-50 rounded-md border">
                  <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}
            >
              Edit Campaign
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewCampaign;
