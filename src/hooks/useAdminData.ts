import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Affiliate } from '@/types/affiliate';

interface AdminData {
  totalUsers: number;
  totalAffiliates: number;
  pendingAffiliates: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export const useAdminData = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    totalUsers: 0,
    totalAffiliates: 0,
    pendingAffiliates: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get all affiliates
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (affiliatesError) throw affiliatesError;

      setAffiliates(affiliatesData || []);

      // Calculate stats
      const totalAffiliates = affiliatesData?.length || 0;
      const pendingAffiliates = affiliatesData?.filter(a => a.status !== 'active').length || 0;
      const totalRevenue = affiliatesData?.reduce((sum, a) => sum + (a.total_commissions || 0), 0) || 0;

      // Get profiles count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setAdminData({
        totalUsers: usersCount || 0,
        totalAffiliates,
        pendingAffiliates,
        totalRevenue,
        monthlyRevenue: 0 // Can be calculated from sales table if needed
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    adminData,
    affiliates,
    loading,
    reloadData: loadData
  };
};
