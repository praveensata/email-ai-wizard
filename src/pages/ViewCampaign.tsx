
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getCampaign } from '@/services/campaignService';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Edit, Mail, Share } from 'lucide-react';

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

  const handleShare = () => {
    // Just a simple share functionality for now
    toast({
      title: "Share feature",
      description: "Email content ready to share. This feature will be fully implemented soon.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Send email",
      description: "Email campaign would be sent now. This feature will be fully implemented soon.",
    });
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

  // Extract the content after the subject line
  let emailContent = campaign.content;
  const subjectLineRegex = /Subject Line:\*\*(.*?)$/im;
  const subjectMatch = campaign.content.match(subjectLineRegex);
  if (subjectMatch && subjectMatch.index !== undefined) {
    // Get everything after the subject line
    emailContent = campaign.content.slice(subjectMatch.index + subjectMatch[0].length).trim();
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Details</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSend}
                >
                  <Mail className="h-4 w-4 mr-2" /> Send
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Subject</h3>
                <p className="p-3 bg-gray-50 rounded-md border">{campaign.subject}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Content</h3>
                <div 
                  className="p-4 bg-gray-50 rounded-md border overflow-auto max-h-[500px]" 
                  dangerouslySetInnerHTML={{ __html: emailContent }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ViewCampaign;
