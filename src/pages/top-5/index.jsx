import CompareChart from '@components/CompareChart';
import { compareThemes } from '@constants/themes';
import { ActionList, Button, FormLayout, Page, Popover, TextStyle } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';

function View() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [selected, setSelected] = useState('MinimogWP');

  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      {selected}
    </Button>
  );

  const themeList = ['Structure', 'MaxCoach', 'MinimogWP', 'Heli', 'Brook'].map((theme) => ({
    content: theme,
    onAction: () => {
      setSelected(theme);
      togglePopoverActive();
    },
    active: theme === selected,
  }));

  const themeListCompare = useMemo(() => compareThemes?.[selected], [selected]);

  return (
    <Page fullWidth>
      <FormLayout>
        <TextStyle variation="strong">Choose tracking theme</TextStyle>
        <Popover active={popoverActive} activator={activator} onClose={togglePopoverActive}>
          <ActionList actionRole="menuitem" items={themeList} />
        </Popover>
        <CompareChart showLineChart={true} themeList={themeListCompare} />
      </FormLayout>
    </Page>
  );
}

export default View;
