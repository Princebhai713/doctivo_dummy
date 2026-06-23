'use server';
/**
 * @fileOverview A Genkit flow for summarizing a user's medical history.
 *
 * - getMedicalHistorySummary - A function that handles the summarization of medical history.
 * - MedicalHistorySummaryInput - The input type for the getMedicalHistorySummary function.
 * - MedicalHistorySummaryOutput - The return type for the getMedicalHistorySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalHistorySummaryInputSchema = z.object({
  pastMedicalHistory: z
    .string()
    .describe('Detailed description of past medical history and chronic illnesses.'),
  knownAllergies: z
    .string()
    .describe('Detailed description of known allergies and ongoing medications.'),
});
export type MedicalHistorySummaryInput = z.infer<
  typeof MedicalHistorySummaryInputSchema
>;

const MedicalHistorySummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of key health conditions and allergies, suitable for quick review.'
    ),
  conditions: z
    .array(z.string())
    .describe('A list of key health conditions extracted from the input.'),
  allergies: z
    .array(z.string())
    .describe('A list of known allergies extracted from the input.'),
});
export type MedicalHistorySummaryOutput = z.infer<
  typeof MedicalHistorySummaryOutputSchema
>;

export async function getMedicalHistorySummary(
  input: MedicalHistorySummaryInput
): Promise<MedicalHistorySummaryOutput> {
  return medicalHistorySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalHistorySummaryPrompt',
  input: {schema: MedicalHistorySummaryInputSchema},
  output: {schema: MedicalHistorySummaryOutputSchema},
  prompt: `As a medical assistant, summarize the provided patient's medical background into key health conditions and known allergies.

Provide a concise, easy-to-read summary text. Additionally, extract individual health conditions and allergies into separate lists.

Patient's Past Medical History / Chronic Illnesses:
{{{pastMedicalHistory}}}

Patient's Known Allergies / Ongoing Medications:
{{{knownAllergies}}}

Ensure the output is in the specified JSON format.`,
});

const medicalHistorySummaryFlow = ai.defineFlow(
  {
    name: 'medicalHistorySummaryFlow',
    inputSchema: MedicalHistorySummaryInputSchema,
    outputSchema: MedicalHistorySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
