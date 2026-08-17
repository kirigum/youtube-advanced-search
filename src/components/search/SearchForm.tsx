// import { format } from 'date-fns';
import {
  Activity,
  // CalendarIcon,
  Clock,
  Globe,
  Loader2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { FC, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useYouTubeSearch } from '@/context/youtube-search-context';
import { cn } from '@/lib/utils';
import { SearchFilters } from '@/types';

import { UNIQUE_LANGUAGES, UNIQUE_REGIONS } from './constants';

const validateMinMax = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) {
    return min <= max;
  }

  return true;
};

export const SearchForm: FC = () => {
  const { loading, filters, onSearch, onChangeFilter } = useYouTubeSearch();

  const isSubsError = !validateMinMax(filters.minSubs, filters.maxSubs);
  const isViewsError = !validateMinMax(filters.minViews, filters.maxViews);
  // const isDateError =
  //   filters.customDateFrom !== undefined &&
  //   filters.customDateTo !== undefined &&
  //   filters.customDateFrom > filters.customDateTo;
  const hasErrors = isViewsError || isSubsError;

  const handleNumberChange = (field: keyof SearchFilters, value: string) => {
    if (value === '') {
      onChangeFilter(field, undefined);
      return;
    }
    const parsed = parseInt(value, 10);

    if (!isNaN(parsed) && parsed >= 0) {
      onChangeFilter(field, parsed);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (hasErrors) return;
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 space-y-8">
      <div className="space-y-4">
        <div className="relative flex items-center w-full shadow-sm rounded-2xl bg-background border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            // id="keyword"
            required
            value={filters.keyword}
            placeholder="Search keywords..."
            onChange={(event) => onChangeFilter('keyword', event.target.value)}
            className="pl-12 pr-32 h-14 text-base md:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
          />
          <div className="absolute right-2 flex items-center">
            <Button
              type="submit"
              disabled={loading || hasErrors}
              className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 border border-border/50 p-3 rounded-xl">
          <div className="flex flex-wrap items-center gap-6 px-2">
            <div className="flex items-center space-x-2.5">
              <Switch
                // id="excludeLive"
                checked={filters.excludeLive}
                onCheckedChange={(value) => onChangeFilter('excludeLive', value)}
              />
              <Label
                htmlFor="excludeLive"
                className="font-medium cursor-pointer text-sm text-foreground"
              >
                Exclude Live Streams
              </Label>
            </div>
            <div className="flex items-center space-x-2.5">
              <Switch
                id="withPaidPromotion"
                checked={filters.withPaidPromotion}
                onCheckedChange={(value) => onChangeFilter('withPaidPromotion', value)}
              />
              <Label
                htmlFor="withPaidPromotion"
                className="font-medium cursor-pointer text-sm text-foreground"
              >
                Paid Promotion
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-3 pr-2 w-full sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Label className="whitespace-nowrap text-muted-foreground">Sort by:</Label>
            <Select
              value={filters.order || 'relevance'}
              onValueChange={(value: SearchFilters['order']) => onChangeFilter('order', value)}
            >
              <SelectTrigger className="h-8 border-transparent bg-background shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Upload Date</SelectItem>
                <SelectItem value="viewCount">View Count</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/60 bg-background/50 hover:bg-background transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  isViewsError ? 'text-destructive' : 'text-muted-foreground',
                )}
              >
                Views Limits
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min views"
                  value={filters.minViews}
                  onChange={(event) => handleNumberChange('minViews', event.target.value)}
                  className={cn('bg-background', isViewsError && 'border-destructive')}
                />
                <Input
                  min="0"
                  type="number"
                  placeholder="Max views"
                  value={filters.maxViews}
                  onChange={(event) => handleNumberChange('maxViews', event.target.value)}
                  className={cn('bg-background', isViewsError && 'border-destructive')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  isSubsError ? 'text-destructive' : 'text-muted-foreground',
                )}
              >
                Subscriber Limits
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  value={filters.minSubs}
                  placeholder="Min subs"
                  onChange={(event) => handleNumberChange('minSubs', event.target.value)}
                  className={cn('bg-background', isSubsError && 'border-destructive')}
                />
                <Input
                  type="number"
                  min="0"
                  value={filters.maxSubs}
                  placeholder="Max subs"
                  className={cn('bg-background', isSubsError && 'border-destructive')}
                  onChange={(event) => handleNumberChange('maxSubs', event.target.value)}
                />
              </div>
            </div>

            {(isViewsError || isSubsError) && (
              <p className="text-xs text-destructive font-medium bg-destructive/10 p-2 rounded-md">
                Maximum value cannot be less than minimum.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60 bg-background/50 hover:bg-background transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Time & Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Video Length
              </Label>
              <Select
                value={filters.videoDuration || 'any'}
                onValueChange={(value: SearchFilters['videoDuration']) =>
                  onChangeFilter('videoDuration', value)
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="short">Short (&lt; 4 mins)</SelectItem>
                  <SelectItem value="medium">Medium (4-20 mins)</SelectItem>
                  <SelectItem value="long">Long (&gt; 20 mins)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Publication Date
              </Label>
              <Select
                value={filters.dateFilter || 'any'}
                onValueChange={(value: any) => {
                  onChangeFilter('dateFilter', value);
                  if (value !== 'custom') {
                    onChangeFilter('customDateFrom', undefined);
                    onChangeFilter('customDateTo', undefined);
                  }
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.dateFilter === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full px-2 text-xs justify-start font-normal bg-background',
                        !filters.customDateFrom && 'text-muted-foreground',
                        isDateError && 'border-destructive',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.customDateFrom
                        ? format(filters.customDateFrom, 'MMM d, yyyy')
                        : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.customDateFrom}
                      onSelect={(d) => onChangeFilter('customDateFrom', d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full px-2 text-xs justify-start font-normal bg-background',
                        !filters.customDateTo && 'text-muted-foreground',
                        isDateError && 'border-destructive',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.customDateTo
                        ? format(filters.customDateTo, 'MMM d, yyyy')
                        : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.customDateTo}
                      onSelect={(d) => onChangeFilter('customDateTo', d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {isDateError && (
                  <p className="col-span-2 text-xs text-destructive font-medium">
                    Invalid date range.
                  </p>
                )}
              </div>
            )} */}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60 bg-background/50 hover:bg-background transition-colors md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              Audience & Geography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Language
                </Label>
                <Combobox
                  options={UNIQUE_LANGUAGES}
                  value={filters.relevanceLanguage || 'any'}
                  onChange={(value) => onChangeFilter('relevanceLanguage', value)}
                  searchPlaceholder="Search languages..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Region
                </Label>
                <Combobox
                  options={UNIQUE_REGIONS}
                  value={filters.regionCode || 'any'}
                  onChange={(value) => onChangeFilter('regionCode', value)}
                  searchPlaceholder="Search countries..."
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Exclude Channel Regions
              </Label>
              <MultiSelect
                options={UNIQUE_REGIONS}
                selected={filters.excludedRegions || []}
                onChange={(values) => onChangeFilter('excludedRegions', values)}
                placeholder="Block specific countries..."
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
