import MainContent from '../_components/MainContent';

export function generateStaticParams() {
  return [{}];
}

export default function CatchAllPage() {
  return <MainContent />;
}
