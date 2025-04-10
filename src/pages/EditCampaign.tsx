
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { getCampaign, updateCampaign } from '@/services/campaignService';
import { generateEmailContent } from '@/services/geminiService';
import { CustomerSegment, customerSegmentOptions } from '@/types/campaign';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Save, Sparkles, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Form schema using Zod
const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  subject: z.string().min(1, 'Email subject is required'),
  content: z.string().min(1, 'Email content is required'),
  customerSegment: z.nativeEnum(CustomerSegment),
  scheduledDate: z.date().optional(),
  productDetails: z.string().optional(),
  campaignGoal: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const EditCampaign = () => {
  const { id } = useParams<{ id: string }>();
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // React Hook Form with Zod validation
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      content: '',
      customerSegment: CustomerSegment.AllCustomers,
      productDetails: '',
      campaignGoal: '',
    },
  });

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const campaignData = await getCampaign(id);
        
        // Set form values
        form.reset({
          name: campaignData.name,
          subject: campaignData.subject,
          content: campaignData.content,
          customerSegment: campaignData.customerSegment,
          scheduledDate: campaignData.scheduledDate,
          // These might not exist in older campaigns
          productDetails: '',
          campaignGoal: '',
        });
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load campaign data",
        });
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id, form, navigate, toast]);

  // Generate email content using Gemini API
  const handleGenerateEmail = async () => {
    try {
      const productDetails = form.getValues('productDetails');
      const customerSegment = form.getValues('customerSegment');
      const campaignGoal = form.getValues('campaignGoal');
      
      if (!productDetails || !customerSegment || !campaignGoal) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in product details, customer segment, and campaign goal.",
        });
        return;
      }

      setGeneratingEmail(true);
      
      // Get customer segment label from options
      const segmentOption = customerSegmentOptions.find(option => option.value === customerSegment);
      const segmentLabel = segmentOption ? segmentOption.label : customerSegment;

      const result = await generateEmailContent(
        undefined,
        productDetails,
        segmentLabel,
        campaignGoal
      );

      if (result.success && result.data) {
        // Set the whole content directly without HTML tags
        const content = result.data;
        
        // Try to extract a subject line from the content
        const subjectLineRegex = /subject:?\s*([^\n]+)/i;
        const subjectMatch = content.match(subjectLineRegex);
        if (subjectMatch && subjectMatch[1]) {
          form.setValue('subject', subjectMatch[1].trim());
        }
        
        // Extract clean content without HTML tags
        let cleanContent = content;
        // Remove any Subject: line from the content
        cleanContent = cleanContent.replace(/subject:.*\n/i, '');
        
        form.setValue('content', cleanContent);
        
        toast({
          title: "Email generated successfully",
          description: "AI-generated email content has been added to your campaign.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: result.error || "Failed to generate email content. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error generating email content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while generating email content.",
      });
    } finally {
      setGeneratingEmail(false);
    }
  };

  // Submit form handler
  const onSubmit = async (values: CampaignFormValues) => {
    if (!currentUser?.uid || !id) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to update a campaign.",
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const campaignData = {
        name: values.name,
        subject: values.subject,
        content: values.content,
        customerSegment: values.customerSegment,
        scheduledDate: values.scheduledDate
      };
      
      await updateCampaign(id, campaignData);
      
      toast({
        title: "Campaign updated",
        description: "Your campaign has been updated successfully.",
      });
      
      navigate('/campaigns');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        variant: "destructive",
        title: "Failed to update campaign",
        description: "There was an error updating your campaign. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
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

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/campaigns')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
          <h1 className="text-2xl font-bold">Edit Campaign</h1>
          <p className="text-gray-600">Update your email marketing campaign</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="ai-assistant">
              <TabsList className="mb-6">
                <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="content">Campaign Content</TabsTrigger>
                <TabsTrigger value="settings">Settings & Scheduling</TabsTrigger>
              </TabsList>
              
              {/* AI Assistant Tab (First) */}
              <TabsContent value="ai-assistant">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Email Generator</CardTitle>
                      <CardDescription>Let AI craft your email content based on your products and goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="productDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product or service in detail (features, benefits, pricing, etc.)"
                                {...field}
                                className="min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="campaignGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Goal</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What's the goal of this campaign? (generate sales, announce a new product, promote an event, etc.)"
                                {...field}
                                className="min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        onClick={handleGenerateEmail}
                        disabled={generatingEmail}
                        className="w-full"
                      >
                        {generatingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {generatingEmail ? 'Generating...' : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Email Content
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Content Tab (Second) */}
              <TabsContent value="content">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Details</CardTitle>
                      <CardDescription>Define your email campaign information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Spring Sale 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Subject Line</FormLabel>
                            <FormControl>
                              <Input placeholder="Don't miss our biggest sale of the year!" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Write your email content here or use our AI assistant to generate it..." 
                                className="min-h-[300px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Settings Tab (Third) */}
              <TabsContent value="settings">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Settings</CardTitle>
                      <CardDescription>Configure delivery options and targeting</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customerSegment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Segment</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a customer segment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {customerSegmentOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div>
                                      <div className="font-medium">{option.label}</div>
                                      <p className="text-xs text-gray-500">{option.description}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Scheduled Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                            {!field.value && (
                              <p className="text-sm text-muted-foreground">
                                If no date is selected, the campaign will be saved as a draft.
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/campaigns')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLoading ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default EditCampaign;
