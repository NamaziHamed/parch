"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AppHeader from "@/components/dashboard/AppHeader";
import NotesSkeleton from "@/components/dashboard/NotesSkeleton";
import { EmptyNotebook, NoResults } from "@/components/dashboard/EmptyState";
import MasonaryLayout from "@/components/dashboard/MasonaryLayout";
import AddNewNote from "@/components/dashboard/AddNewNote";
import SearchBox from "@/components/dashboard/SearchBox";
import { NoteData } from "@/utils/types";
import axios from "axios";
import { toast } from "sonner";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<NoteData[]>([]);
  const [filtered, setFiltered] = useState(data);
  const [searchText, setSearchText] = useState("");
  // UI-only flag so we can show skeletons instead of an empty state on first load.
  const [isFetching, setIsFetching] = useState(true);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value.length) {
      const res = data.filter((note) => {
        const search =
          note.plainText?.toLowerCase().includes(value) ||
          note.title?.toLowerCase().includes(value);
        if (search) return note;
      });
      setFiltered(res);
    } else {
      setFiltered(data);
    }
  };

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const res = await axios.get("/api/note");
        if (res.status === 200) {
          setData(res.data);
          setFiltered(res.data);
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserNotes();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const res = await axios.delete(`/api/note/${id}`);
      if (res.status === 200) {
        setData(data.filter((note) => note.id != id));
        setFiltered(filtered.filter((note) => note.id !== id));
        toast.success("Note deleted successfully");
      } else {
        toast.error("Something went wrong! please try again!");
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete note! please try again!");
    }
  };

  const isLoading = status === "loading" || isFetching;
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="min-h-dvh">
      <AppHeader session={session} />
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 sm:pt-12">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {firstName ? `Hello, ${firstName}` : "Your notebook"}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              All notes
              {!isLoading && data.length > 0 && (
                <span className="ms-3 align-middle font-sans text-sm font-normal text-muted-foreground tabular-nums">
                  {searchText
                    ? `${filtered.length} of ${data.length}`
                    : data.length}
                </span>
              )}
            </h1>
          </div>
          {(isLoading || data.length > 0) && (
            <SearchBox text={searchText} search={handleSearch} />
          )}
        </div>

        {isLoading ? (
          <NotesSkeleton />
        ) : data.length === 0 ? (
          <EmptyNotebook />
        ) : filtered.length === 0 ? (
          <NoResults query={searchText} onClear={() => handleSearch("")} />
        ) : (
          <MasonaryLayout data={filtered} onRemove={handleRemove} />
        )}
      </main>
      <AddNewNote />
    </div>
  );
};

export default DashboardPage;
