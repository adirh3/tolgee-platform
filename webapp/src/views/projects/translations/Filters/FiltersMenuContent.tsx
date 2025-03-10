import { Checkbox, ListItemText } from '@mui/material';

import {
  useTranslationsDispatch,
  useTranslationsSelector,
} from '../context/TranslationsContext';
import { SubmenuStates } from './SubmenuStates';
import { SubmenuTags } from './SubmenuTags';
import { CompactListSubheader, CompactMenuItem } from './FiltersComponents';
import { toggleFilter, useAvailableFilters } from './useAvailableFilters';
import { useActiveFilters } from './useActiveFilters';

export const FiltersMenuContent = () => {
  const options: any[] = [];
  const dispatch = useTranslationsDispatch();
  const filtersObj = useTranslationsSelector((v) => v.filters);
  const selectedLanguages = useTranslationsSelector((v) => v.selectedLanguages);

  const activeFilters = useActiveFilters();

  const handleFilterToggle = (rawValue: string) => () => {
    const newFilters = toggleFilter(filtersObj, availableFilters, rawValue);
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const availableFilters = useAvailableFilters(selectedLanguages);

  availableFilters.forEach((group, i1) => {
    if (!group.options?.length) {
      return;
    } else {
      if (group.type !== 'tags') {
        options.push(
          <CompactListSubheader
            key={i1}
            disableSticky
            data-cy="translations-filters-subheader"
          >
            {group.name}
          </CompactListSubheader>
        );
      }

      group.options.forEach((option, i2) => {
        if (group.type === undefined) {
          options.push(
            <CompactMenuItem
              data-cy="translations-filter-option"
              key={`${i1}.${i2}`}
              value={option.value!}
              onClick={handleFilterToggle(option.value!)}
            >
              <Checkbox
                size="small"
                edge="start"
                checked={activeFilters.includes(option.value!)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={option.label} />
            </CompactMenuItem>
          );
        } else if (group.type === 'states') {
          options.push(
            <SubmenuStates
              key={`${i1}.${i2}`}
              data-cy="translations-filter-option"
              item={option}
              handleToggle={handleFilterToggle}
              activeFilters={activeFilters}
            />
          );
        } else if (group.type === 'tags') {
          options.push(
            <SubmenuTags
              key={`${i1}.${i2}`}
              item={option}
              handleToggle={handleFilterToggle}
              activeFilters={activeFilters}
            />
          );
        }
      });
    }
  });
  return <>{options}</>;
};
