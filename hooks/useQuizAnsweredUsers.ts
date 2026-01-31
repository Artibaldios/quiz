"use client"
import { useMemo, useState } from "react";

export function useQuizAnsweredUsers() {
  const [currentAnsweredUsersMap, setCurrentAnsweredUsersMap] = useState<Map<string, string>>(new Map());

  const currentAnsweredUsers = currentAnsweredUsersMap.size;
  const currentAnsweredUsersArr = useMemo(() =>
    Array.from(currentAnsweredUsersMap.entries()).map(([userId, username]) => ({
      userId,
      name: username
    })),
    [currentAnsweredUsersMap]
  );

  return {
    currentAnsweredUsersMap,
    setCurrentAnsweredUsersMap,
    currentAnsweredUsers,
    currentAnsweredUsersArr
  };
}