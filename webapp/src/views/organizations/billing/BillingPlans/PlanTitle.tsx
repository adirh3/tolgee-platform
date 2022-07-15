import { styled, Typography } from '@mui/material';

const StyledWrapper = styled('div')`
  grid-area: title;
  display: grid;
  height: 40px;
`;

const StyledMainTitle = styled(Typography)``;

type Props = {
  title: string;
};

export const PlanTitle: React.FC<Props> = ({ title }) => {
  return (
    <StyledWrapper>
      <StyledMainTitle variant="h4">{title}</StyledMainTitle>
    </StyledWrapper>
  );
};
