import React from "react";
import { createUseStyles } from "react-jss";
import { DateTime } from "luxon";
import { Calendar } from "primereact/calendar";

const CalendarPicker = ({getDate}) => {
  const classes = useStyles()
  const minAccept = DateTime.now().plus({ days: 6 }).toISO();
  const minDate = new Date(minAccept);
  const maxAccept = DateTime.now().plus({ days: 10, month: 1 }).toISO();
  const maxDate = new Date(maxAccept);

  return (
    <Calendar
      className={classes.calendar}
      onChange={(e) => getDate(e.value)}
      inline
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

export default CalendarPicker;

const useStyles = createUseStyles({
  calendar: {
    width: "100%",
    marginBottom: '10px'
  },
});
