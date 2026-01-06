import { Header, Hero, EventsSection, Footer } from './(frontpage)/_components';
import { getApiUrl } from '@/utils/urls';

interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  startsAt: string | null;
  endsAt: string | null;
  themeName: string | null;
}

interface PublicEventsResponse {
  success: boolean;
  events: PublicEvent[];
}

async function getPublicEvents(): Promise<PublicEvent[]> {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/v1/events/public`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data: PublicEventsResponse = await response.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const events = await getPublicEvents();

  return (
    <div className="min-h-screen bg-nory-white font-grotesk">
      <Header />
      <main>
        <Hero events={events} />
        <EventsSection events={events} />
      </main>
      <Footer />
    </div>
  );
}
