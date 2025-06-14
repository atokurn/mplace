import { getUsers } from "@/app/_lib/queries/users";
import { usersSearchParamsCache } from "@/lib/search-params";
import { UserTable } from "./UserTable";

interface UserTableWrapperProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function UserTableWrapper({ searchParams }: UserTableWrapperProps) {
  const search = usersSearchParamsCache.parse(searchParams);
  const { data: users, pageCount } = await getUsers(search);

  return <UserTable users={users} pageCount={pageCount} />;
}