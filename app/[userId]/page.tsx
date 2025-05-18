import ClientUserProfile from "./ClientUserProfile";

interface Props {
  params: { userId: string };
}

export default function Page({ params }: Props) {
  return <ClientUserProfile userId={params.userId} />;
}
