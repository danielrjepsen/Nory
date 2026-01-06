import { EventSlideshow } from '../_components';

interface PageProps {
  params: {
    eventId: string;
  };
}

export default function EventSlideshowPage({ params }: PageProps) {
  return <EventSlideshow eventId={params.eventId} />;
}