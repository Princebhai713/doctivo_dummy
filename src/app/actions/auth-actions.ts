
'use server';

import { query } from '@/lib/db';
import { getPatientByPhone, getFamilyMembers } from './patient-actions';
import { getUserAppointments } from './appointment-actions';

/**
 * Direct Login without OTP for Prototype/Speed.
 * Fetches user profile and all related data in one go.
 */
export async function loginWithoutOtp(phoneNumber: string) {
  if (!phoneNumber || phoneNumber.length !== 10) {
    throw new Error('Invalid phone number');
  }

  try {
    // 1. Check if patient exists
    const existingUser = await getPatientByPhone(phoneNumber);
    
    if (existingUser) {
      // 2. Fetch related data
      const [familyMembers, appointments] = await Promise.all([
        getFamilyMembers(existingUser.id),
        getUserAppointments(existingUser.id)
      ]);

      return { 
        success: true, 
        newUser: false,
        user: existingUser,
        familyMembers,
        appointments
      };
    } else {
      // 3. New user flow
      return { 
        success: true, 
        newUser: true,
        user: { 
          id: `DOC-USR-${Date.now()}`, 
          phone: phoneNumber, 
          isProfileComplete: false 
        } 
      };
    }
  } catch (error: any) {
    console.error('Login Action Error:', error.message);
    return { success: false, error: 'Database synchronization failed. Please check connection.' };
  }
}

/**
 * Legacy functions removed to prevent confusion
 */
export async function initiateLogin(phoneNumber: string) {
  return { success: true, message: 'OTP System Disabled: Use direct login.' };
}

export async function verifyOtpCode(phoneNumber: string, code: string) {
  return { success: true };
}
