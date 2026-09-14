import ProfilePage from '../../views/components/ProfilePage';

export const metadata = {
  title: 'Student Profile | CodeGuru Learning Account',
  description: 'Manage your CodeGuru account profile, enrolled batch details, certificates, and personal info.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileRoute({ onOpenContactModal }) {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <ProfilePage onOpenContactModal={onOpenContactModal} />
    </div>
  );
}
