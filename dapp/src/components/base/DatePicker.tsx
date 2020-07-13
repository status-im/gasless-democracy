import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import blue from "@material-ui/core/colors/lightBlue";
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: blue.A200,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: blue.A200,
        // color: "white",
      },
    },
    MuiPickersDay: {
      day: {
        color: blue.A700,
      },
      daySelected: {
        backgroundColor: blue["400"],
      },
      dayDisabled: {
        color: blue["100"],
      },
      current: {
        color: blue["900"],
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: blue["400"],
      },
    },
  },
});


type DatePickerProps = {
  setFieldValue: (field: any, value: any, shouldValidate?: boolean) => void,
  onBlur?: React.FocusEventHandler<{}>,
  value?: Date | null,
  name?: string,
  className?: string
}

export default function DatePicker({
  value,
  name,
  className,
  setFieldValue
}: DatePickerProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={materialTheme}>
      <DateTimePicker
        className={className}
        name={name}
        inputVariant="outlined"
        margin="normal"
        id="date-picker-inline"
        label="Poll end time"
        value={value}
        onChange={date => setFieldValue(name, date, false)}
      />
    </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}
