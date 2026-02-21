import React from 'react'
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

export default function SearchBar({ searchInputRef, searchQuery, handleSearchInputChange, className, placeholder }) {
  return (
    <main className={cn("px-3 w-fit bg-background border rounded-full flex items-center", className)} >
      <span>
        <Search className="size-4" />
      </span>
      <span>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder ? placeholder : "Search items.."}
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 bg-transparent border-none focus:ring-0 focus:border-none focus:outline-none focus-visible:ring-0 rounded-full"
        />
      </span>
    </main >
  )
}
