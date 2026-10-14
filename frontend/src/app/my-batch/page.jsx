import MyBatchPage from '../../views/pages/MyBatchPage';

export const metadata = {
  title: 'My Batch Portal | CodeGurru Student Portal & Schedule',
  description:
    'Access your enrolled CodeGurru student batch, live classes schedule, assignment submissions, mentor support, and course progress.',
  keywords: [
    'CodeGurru My Batch',
    'Student Portal CodeGurru',
    'Batch Schedule',
    'Enrolled Student Dashboard',
  ],
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/my-batch`,
  },
};

export default function StudentBatchRoute({ onOpenContactModal, onOpenEnrollModal }) {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <MyBatchPage onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} />
    </div>
  );
}
