
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, Phone } from 'lucide-react';
import { loginWithoutOtp } from '@/app/actions/auth-actions';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { Patient } from '@/lib/types';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const setUserStore = useStore(state => state.setUser);
  const setPatientsStore = useStore(state => state.setPatients);
  const setAppointmentsStore = useStore(state => state.setAppointments);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (user.isProfileComplete) {
        router.push('/home');
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async () => {
    if (phone.length !== 10) return;
    
    setIsLoading(true);
    try {
      const result = await loginWithoutOtp(phone);
      
      if (result.success) {
        if (result.newUser) {
          // New User
          setUserStore(result.user as any);
          setIsAuthenticated(true);
          toast({ title: "Welcome!", description: "Please complete your profile to start booking." });
          router.push('/onboarding');
        } else {
          // Existing User - Sync Data
          setUserStore(result.user as any);
          
          const fullPatientList: Patient[] = [
            { ...result.user, relation: 'Self' } as Patient,
            ...(result.familyMembers || [])
          ];
          
          setPatientsStore(fullPatientList);
          setAppointmentsStore(result.appointments || []);
          setIsAuthenticated(true);
          
          toast({ title: "Welcome Back!", description: "Your health records are synced." });
          
          if (result.user.isProfileComplete) {
            router.push('/home');
          } else {
            router.push('/onboarding');
          }
        }
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: result.error });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container p-6 bg-[#F8FAFF]">
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center mb-12 space-y-4 w-full">
          <div className="bg-primary h-20 w-20 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20 mb-2">
            <span className="text-white text-4xl font-extrabold">D</span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">DOCTIVO</h1>
            <p className="text-slate-400 text-sm font-medium">Healthcare Simplified</p>
          </div>
        </div>

        <Card className="w-full bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
          <CardContent className="pt-8 px-6 pb-8 space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl font-bold text-[#1E293B]">Enter Phone Number</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Login instantly with your mobile number.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center border border-slate-100 rounded-2xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="pl-4 pr-3 text-[#1E293B] font-bold text-lg border-r border-slate-50 py-4">+91</span>
                <Input 
                  type="tel" 
                  placeholder="9876543210" 
                  className="border-none shadow-none focus-visible:ring-0 h-14 text-lg font-medium text-[#1E293B] placeholder:text-slate-300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <Button 
                className="w-full h-16 text-base font-bold bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                onClick={handleLogin}
                disabled={phone.length !== 10 || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>Continue <ArrowRight className="h-5 w-5" /></>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pb-8 text-center px-4 mt-auto">
        <p className="text-[10px] text-slate-400 leading-normal">
          Secure, direct access to Gorakhpur's best doctors.
        </p>
      </div>
    </div>
  );
}
