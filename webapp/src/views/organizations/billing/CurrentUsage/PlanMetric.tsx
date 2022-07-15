import { Box, styled } from '@mui/material';
import clsx from 'clsx';
import { BillingProgress } from 'tg.component/billing/BillingProgress';
import { BILLING_CRITICAL_PERCENT } from 'tg.component/billing/constants';
import { useNumberFormatter } from 'tg.hooks/useLocale';

export const StyledMetrics = styled('div')`
  display: grid;
  grid-template-columns: auto auto 2fr;
  gap: 4px 8px;
  margin: 16px 0px;
`;

const StyledName = styled(Box)`
  grid-column: 0;
  padding-right: 10px;
  font-size: 15px;
`;

const StyledProgress = styled(Box)`
  display: grid;
  align-items: center;
`;

const StyledValue = styled('span')`
  &.red {
    color: ${({ theme }) => theme.palette.error.main};
  }
  &.green {
    color: ${({ theme }) => theme.palette.success.main};
  }
`;

type Props = {
  name: string;
  currentAmount: number;
  totalAmount?: number;
  periodEnd?: number;
};

export const PlanMetric: React.FC<Props> = ({
  name,
  currentAmount,
  totalAmount,
}) => {
  const formatNumber = useNumberFormatter();
  const showProgress = totalAmount !== undefined;
  const progress = (currentAmount / totalAmount!) * 100;
  const valueClass = progress < BILLING_CRITICAL_PERCENT ? 'red' : 'green';

  return (
    <>
      <StyledName>{name}</StyledName>
      <Box>
        <StyledValue className={clsx({ [valueClass]: showProgress })}>
          {formatNumber(currentAmount)}
        </StyledValue>
        <span>{showProgress ? ` / ${formatNumber(totalAmount!)}` : ''}</span>
      </Box>
      {showProgress && (
        <StyledProgress>
          <BillingProgress percent={progress} height={8} />
        </StyledProgress>
      )}
    </>
  );
};
