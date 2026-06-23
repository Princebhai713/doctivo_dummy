
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Start the flow with the Tutorial as per the flowchart
  redirect('/tutorial');
}
