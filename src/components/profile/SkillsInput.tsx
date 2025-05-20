import { useState, useEffect, useRef } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillsInputProps {
  placeholder: string;
  availableSkills: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const SkillsInput = ({
  placeholder,
  availableSkills,
  value = [],
  onChange,
  className,
}: SkillsInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSkills = availableSkills.filter(skill => 
    !value.includes(skill) && 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelect = (skill: string) => {
    // Only add if not already in the list
    if (!value.includes(skill)) {
      onChange([...value, skill]);
      setSearchQuery("");
    }
    
    // Keep the popover open for multiple selections
    // But move focus back to the input
    const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
    if (input) {
      input.focus();
      input.value = "";
    }
  };
  
  const handleRemove = (skill: string) => {
    onChange(value.filter(s => s !== skill));
  };
  
  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-auto min-h-10 py-2 px-3 text-left font-normal"
          >
            {value.length > 0 ? (
              <span className="text-muted-foreground line-clamp-1">
                {value.length} skill{value.length !== 1 ? "s" : ""} selected
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search skills..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No skills found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredSkills.map((skill) => (
                <CommandItem
                  key={skill}
                  onSelect={() => handleSelect(skill)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(skill) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {skill}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 py-1 px-2 bg-primary/10 text-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemove(skill)}
                className="rounded-full hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ml-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
