import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (itemValue: string) => {
    onChange(selected.filter((i) => i !== itemValue));
  };

  const handleSelect = (itemValue: string) => {
    if (selected.includes(itemValue)) {
      onChange(selected.filter((i) => i !== itemValue)); // Remove if exists
    } else {
      onChange([...selected, itemValue]); // Add if doesn't exist
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between bg-background font-normal h-auto min-h-9 py-1.5 px-3',
            className,
          )}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((val) => {
              const option = options.find((o) => o.value === val);
              if (!option) return null;
              return (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="rounded-sm px-1.5 py-0.5 text-xs font-medium flex items-center gap-1 hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the popover when clicking the badge's X
                    handleUnselect(option.value);
                  }}
                >
                  {option.label}
                  <div className="rounded-full bg-transparent hover:bg-muted-foreground/20 p-0.5 transition-colors">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 text-foreground" align="start">
        <Command>
          <CommandInput placeholder="Search regions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  // Pass label so the text-based search accurately matches what the user types
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
