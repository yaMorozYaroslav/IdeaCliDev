import ClientUserProfile from './ClientUserProfile';

type Props = {
  params: {
    userId: string;
  };
};

export default async function Page({ params }: Props) {
  const userId = params.userId;
  return <ClientUserProfile userId={userId} />;
}
