'use client';

import * as React from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowPresent?: boolean;
  className?: string;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Select date',
  allowPresent = false,
  className,
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();
  
  // Parse the current value
  const parseValue = (val: string) => {
    if (!val || val.toLowerCase() === 'present') {
      return { month: null, year: null, isPresent: val?.toLowerCase() === 'present' };
    }
    const parts = val.split(' ');
    if (parts.length === 2) {
      const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
      const year = parseInt(parts[1]);
      if (monthIndex !== -1 && !isNaN(year)) {
        return { month: monthIndex, year, isPresent: false };
      }
    }
    return { month: null, year: null, isPresent: false };
  };

  const { month: selectedMonth, year: selectedYear, isPresent } = parseValue(value);
  
  // Default to current year for the year selector
  const [displayYear, setDisplayYear] = React.useState(selectedYear || currentYear);

  // Generate years (from 1970 to current year + 10)
  const years = Array.from({ length: currentYear - 1970 + 11 }, (_, i) => 1970 + i).reverse();

  const handleMonthSelect = (monthIndex: number) => {
    const newValue = `${MONTHS[monthIndex]} ${displayYear}`;
    onChange(newValue);
    setOpen(false);
  };

  const handlePresentSelect = () => {
    onChange('Present');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-700">
          {/* Year selector */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDisplayYear(y => y - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </Button>
            <select
              value={displayYear}
              onChange={(e) => setDisplayYear(parseInt(e.target.value))}
              className="text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer text-zinc-900 dark:text-zinc-100"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDisplayYear(y => y + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1">
            {MONTHS.map((month, index) => {
              const isSelected = selectedMonth === index && selectedYear === displayYear;
              return (
                <Button
                  key={month}
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    'h-8 text-xs',
                    isSelected && 'bg-violet-600 text-white hover:bg-violet-700'
                  )}
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Present option */}
        {allowPresent && (
          <div className="p-2 border-t border-zinc-100 dark:border-zinc-700">
            <Button
              variant={isPresent ? 'default' : 'outline'}
              size="sm"
              onClick={handlePresentSelect}
              className={cn(
                'w-full',
                isPresent && 'bg-emerald-600 text-white hover:bg-emerald-700'
              )}
            >
              Present (Current)
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
