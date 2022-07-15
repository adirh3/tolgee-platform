import { Box, BoxProps, styled } from '@mui/material';
import clsx from 'clsx';

import { BILLING_CRITICAL_PERCENT } from './constants';

const StyledContainer = styled(Box)`
  display: grid;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.success.light}55;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
  &.critical {
    background: ${({ theme }) => theme.palette.error.light}99;
  }
`;

const StyledProgress = styled(Box)`
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.success.main};
  transition: all 0.5s ease-in-out;
  &.critical {
    background: ${({ theme }) => theme.palette.error.dark};
  }
`;

type Props = BoxProps & {
  percent: number;
  height?: number;
};

export const BillingProgress: React.FC<Props> = ({
  percent,
  height = 6,
  ...boxProps
}) => {
  const normalized = percent > 100 ? 100 : percent < 0 ? 0 : percent;
  const critical = normalized < BILLING_CRITICAL_PERCENT;
  return (
    <StyledContainer
      className={clsx({ critical })}
      height={height}
      {...boxProps}
    >
      <StyledProgress width={`${normalized}%`} className={clsx({ critical })} />
    </StyledContainer>
  );
};
