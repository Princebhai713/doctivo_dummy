'use server';
/**
 * @fileOverview This file implements a Genkit flow that recommends doctor specializations
 * based on a user's symptoms and medical history.
 *
 * - doctorSpecializationRecommendation - A function that handles the specialization recommendation process.
 * - DoctorSpecializationRecommendationInput - The input type for the doctorSpecializationRecommendation function.
 * - DoctorSpecializationRecommendationOutput - The return type for the doctorSpecializationRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DoctorSpecializationRecommendationInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the user\'s current symptoms.'),
  medicalHistory: z
    .string()
    .describe('Past medical history or chronic illnesses (e.g., Sugar, BP, Diabetes).'),
  allergiesMedications: z
    .string()
    .describe('Known allergies or ongoing medications.'),
});
export type DoctorSpecializationRecommendationInput = z.infer<
  typeof DoctorSpecializationRecommendationInputSchema
>;

const DoctorSpecializationRecommendationOutputSchema = z.object({
  specializations: z
    .array(z.string())
    .describe(
      'An array of recommended doctor specializations based on the input symptoms and medical history. Examples: General Physician, Pediatrician, Dentist, Eye Specialist, Cardiologist, Orthopedic.'
    ),
});
export type DoctorSpecializationRecommendationOutput = z.infer<
  typeof DoctorSpecializationRecommendationOutputSchema
>;

export async function doctorSpecializationRecommendation(
  input: DoctorSpecializationRecommendationInput
): Promise<DoctorSpecializationRecommendationOutput> {
  return doctorSpecializationRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'doctorSpecializationRecommendationPrompt',
  input: { schema: DoctorSpecializationRecommendationInputSchema },
  output: { schema: DoctorSpecializationRecommendationOutputSchema },
  prompt: `You are an intelligent medical recommendation system designed to suggest doctor specializations based on a patient's symptoms and medical background.
Your goal is to analyze the provided information and list all highly relevant doctor specializations. If no specific specialization is clear, suggest 'General Physician'.

Available Specializations (use these if applicable):
- General Physician
- Pediatrician
- Dentist
- Eye Specialist
- Cardiologist
- Orthopedic
- Dermatologist (for skin issues)
- Pulmonologist (for lung/respiratory issues)
- Endocrinologist (for diabetes, thyroid, hormonal issues)

Patient Symptoms: {{{symptoms}}}
Past Medical History / Chronic Illnesses: {{{medicalHistory}}}
Known Allergies / Ongoing Medications: {{{allergiesMedications}}}`,
});

const doctorSpecializationRecommendationFlow = ai.defineFlow(
  {
    name: 'doctorSpecializationRecommendationFlow',
    inputSchema: DoctorSpecializationRecommendationInputSchema,
    outputSchema: DoctorSpecializationRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
