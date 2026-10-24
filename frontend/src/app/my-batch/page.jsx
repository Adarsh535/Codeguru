import MyBatchPage from '../../views/pages/MyBatchPage';

export const metadata = {
  title: 'Student Batch Portal & Schedule',
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
    canonical: 'https://codegurru.in/my-batch',
  },
};

export default function StudentBatchRoute({ onOpenContactModal, onOpenEnrollModal }) {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <MyBatchPage onOpenContactModal={onOpenContactModal} onOpenEnrollModal={onOpenEnrollModal} />
    </div>
  );
}
