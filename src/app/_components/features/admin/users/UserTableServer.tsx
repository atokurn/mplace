import { usersSearchParamsCache } from "@/lib/search-params";
import type { SearchParams } from "@/types";
import * as React from "react";
import { UserTableClient } from "./UserTableClient";
import { getUsers, getUserRoleCounts } from "@/app/_lib/queries/users";

interface UserTableServerProps {
  searchParams: SearchParams;
}

export async function UserTableServer({ searchParams }: UserTableServerProps) {
  const search = usersSearchParamsCache.parse(searchParams);
  
  const usersPromise = getUsers(search);
  const roleCounts = await getUserRoleCounts();

  return <UserTableClient usersPromise={usersPromise} roleCounts={roleCounts} />;
}