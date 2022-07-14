import { styled, Typography } from '@mui/material';

const StyledWrapper = styled('div')`
  grid-area: title;
  display: grid;
  height: 40px;
`;

const StyledMainTitle = styled(Typography)``;

const StyledSecondaryTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 14px;
`;

type Props = {
  title: string;
  subtitle?: string;
};

export const PlanTitle: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <StyledWrapper>
      <StyledMainTitle variant="h4" data-cy="billing-plan-title">
        {title}
      </StyledMainTitle>
      {subtitle && (
        <StyledSecondaryTitle
          variant="subtitle1"
          data-cy="billing-plan-subtitle"
        >
          {subtitle}
        </StyledSecondaryTitle>
      )}
    </StyledWrapper>
  );
};
