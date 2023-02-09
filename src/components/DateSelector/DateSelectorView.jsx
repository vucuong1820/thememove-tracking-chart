import { Button, Checkbox, FormLayout, Popover, Select, Stack } from '@shopify/polaris';
import { CalendarMinor } from '@shopify/polaris-icons';
import ComparedDate from './components/ComparedDate';
import SelectedDate from './components/SelectedDate';
import { DateWrapper } from './dateSelector.styles';
import useDateSelector from './useDateSelector';

function DateSelector({
  onlyCompare,
  onlyDefault,
  onConfirm = () => {},
  selectedDate,
  comparedDate,
  onChangeSelectedDate = () => {},
  onChangeComparedDate = () => {},
}) {
  const {
    handleApply,
    setDateSelectedOption,
    handleCheck,
    dateOptions,
    toggleDateSelector,
    active,
    dateSelectedOption,
    handleChangeSelect,
    compare,
    setDateOptions,
    handleCloseDateSelector,
  } = useDateSelector({
    onlyCompare,
    onlyDefault,
    onChangeSelectedDate,
    onChangeComparedDate,
    selectedDate,
    comparedDate,
    onConfirm,
  });
  const activator = (
    <Button icon={CalendarMinor} onClick={toggleDateSelector}>
      <div style={{ textTransform: 'capitalize' }}>{dateOptions.find((x) => x.value === dateSelectedOption)?.label}</div>
    </Button>
  );
  // conso
  return (
    <Popover active={active} activator={activator} onClose={handleCloseDateSelector} fluidContent fullHeight>
      <Popover.Pane>
        <Popover.Section>
          <DateWrapper expand={compare}>
            <FormLayout>
              <Select options={dateOptions} value={dateSelectedOption} onChange={handleChangeSelect} label="Date range" />
              {!(onlyCompare || onlyDefault) && <Checkbox checked={compare} onChange={handleCheck} label="Compare with custom period" />}

              <SelectedDate
                onChangeDate={onChangeSelectedDate}
                dates={selectedDate}
                onChangeOptions={setDateOptions}
                onSetSelected={setDateSelectedOption}
              />
            </FormLayout>
            {compare && (
              <div className="compare-date">
                <ComparedDate onChangeDate={onChangeComparedDate} dates={comparedDate} />
              </div>
            )}
          </DateWrapper>
        </Popover.Section>
      </Popover.Pane>

      <Popover.Pane fixed>
        <Popover.Section>
          <Stack>
            <Stack.Item fill>
              <Button onClick={handleCloseDateSelector}>Cancel</Button>
            </Stack.Item>
            <Button primary onClick={handleApply}>
              Apply
            </Button>
          </Stack>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
}

export default DateSelector;
