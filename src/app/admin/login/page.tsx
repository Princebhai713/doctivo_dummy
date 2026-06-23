
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Loader2, Mail, ArrowRight } from 'lucide-react';
import { adminLogin } from '@/app/actions/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  const setAdmin = useStore(state => state.setAdmin);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    
    // For MVP/Demo: Super Admin bypass
    if (email === 'admin@doctivo.com') {
      const superAdminData = {
        admin_id: 'SUPER-1',
        full_name: 'Super Administrator',
        email: 'admin@doctivo.com',
        role: 'Super Admin',
        permissions: {
          dashboard: { view: true, view_financials: true },
          doctors: { view: true, approve: true, suspend: true },
          bookings: { view: true, modify: true },
          payroll: { view: true, adjust: true, settle: true },
          exporter: { allow_export: true }
        }
      };
      setIsAuthenticated(true);
      setAdmin(superAdminData);
      toast({ title: 'Super Admin Login', description: 'Welcome back to the command center.' });
      router.push('/admin');
      setLoading(false);
      return;
    }

    const res = await adminLogin(email);
    if (res.success) {
      setIsAuthenticated(true);
      // Ensure permissions is parsed if it came back as string from DB
      let perms = res.admin.permissions;
      if (typeof perms === 'string') {
        try {
          perms = JSON.parse(perms);
        } catch (e) {
          console.error('Failed to parse permissions:', e);
          perms = {};
        }
      }
      
      const adminData = {
        ...res.admin,
        permissions: perms
      };
      setAdmin(adminData);
      toast({ title: 'Login Successful', description: `Welcome, ${adminData.full_name}` });
      router.push('/admin');
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: res.error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
      <Card className="w-full max-w-md border-none bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-10 flex flex-col items-center">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <ShieldCheck className="text-white h-10 w-10" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">DOCTIVO ADMIN</h1>
          <p className="text-blue-100 text-sm font-medium opacity-80 mt-1">Management Portal Access</p>
        </div>

        <CardContent className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input 
                type="email" 
                placeholder="admin@doctivo.com" 
                className="pl-12 h-14 bg-slate-700/50 border-none text-white rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button 
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-lg font-black rounded-2xl shadow-xl shadow-blue-600/20"
            onClick={handleLogin}
            disabled={loading || !email}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>}
          </Button>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Authorized Personnel Only. <br/>All access is monitored and logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
