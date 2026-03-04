import MainContent from '../_components/MainContent';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function CatchAllPage() {
  return <MainContent />;
}
