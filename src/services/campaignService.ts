import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { CampaignStatus, CustomerSegment } from '@/types/campaign';

// Add a new campaign
export const addCampaign = async (userId: string, campaignData: { 
  name: string;
  subject: string;
  content: string;
  customerSegment: CustomerSegment;
  scheduledDate?: Date;
}) => {
  try {
    const campaignRef = await addDoc(collection(db, 'campaigns'), {
      ...campaignData,
      userId,
      status: CampaignStatus.Draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      scheduledDate: campaignData.scheduledDate ? Timestamp.fromDate(campaignData.scheduledDate) : null,
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      }
    });
    
    return campaignRef.id;
  } catch (error) {
    console.error('Error adding campaign:', error);
    throw error;
  }
};

// Get all campaigns for a user
export const getCampaigns = async (userId: string) => {
  try {
    const q = query(collection(db, 'campaigns'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to JavaScript Date
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        scheduledDate: data.scheduledDate?.toDate ? data.scheduledDate.toDate() : null,
      };
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    throw error;
  }
};

// Get a single campaign
export const getCampaign = async (campaignId: string) => {
  try {
    const docRef = doc(db, 'campaigns', campaignId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamp to JavaScript Date
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        scheduledDate: data.scheduledDate?.toDate ? data.scheduledDate.toDate() : null,
      };
    } else {
      throw new Error('Campaign not found');
    }
  } catch (error) {
    console.error('Error getting campaign:', error);
    throw error;
  }
};

// Update a campaign
export const updateCampaign = async (campaignId: string, campaignData: Partial<{
  name: string;
  subject: string;
  content: string;
  status: CampaignStatus;
  scheduledDate: Date;
  customerSegment: CustomerSegment;
}>) => {
  try {
    const campaignRef = doc(db, 'campaigns', campaignId);
    
    let updateData = { ...campaignData, updatedAt: serverTimestamp() };
    
    // Convert Date to Firestore Timestamp if scheduledDate exists
    if (campaignData.scheduledDate) {
      updateData = {
        ...updateData,
        scheduledDate: Timestamp.fromDate(campaignData.scheduledDate)
      } as any; // Using type assertion to avoid TypeScript errors
    }
    
    await updateDoc(campaignRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};

// Delete a campaign
export const deleteCampaign = async (campaignId: string) => {
  try {
    const campaignRef = doc(db, 'campaigns', campaignId);
    await deleteDoc(campaignRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};

// Update campaign stats (for demo purposes)
export const updateCampaignStats = async (campaignId: string, stats: {
  sent?: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  unsubscribed?: number;
}) => {
  try {
    const campaignRef = doc(db, 'campaigns', campaignId);
    const docSnap = await getDoc(campaignRef);
    
    if (!docSnap.exists()) {
      throw new Error('Campaign not found');
    }
    
    const currentStats = docSnap.data()?.stats || {
      sent: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    };
    
    const updatedStats = {
      sent: stats.sent !== undefined ? stats.sent : currentStats.sent,
      opened: stats.opened !== undefined ? stats.opened : currentStats.opened,
      clicked: stats.clicked !== undefined ? stats.clicked : currentStats.clicked,
      bounced: stats.bounced !== undefined ? stats.bounced : currentStats.bounced,
      unsubscribed: stats.unsubscribed !== undefined ? stats.unsubscribed : currentStats.unsubscribed
    };
    
    await updateDoc(campaignRef, {
      stats: updatedStats,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating campaign stats:', error);
    throw error;
  }
};
