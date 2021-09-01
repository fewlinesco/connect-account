//@ts-nocheck
import React from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

const WEEKDAYS_SHORT = {
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  fr: ["Lu", "Ma", "Me", "Je", "Vr", "Sa", "Di"],
};

const WEEKDAYS_LONG = {
  en: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  fr: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
};

const MONTHS = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  fr: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
};

const FIRST_DAY_OF_WEEK = {
  en: 1,
  fr: 1,
};

// Translate aria-labels
const LABELS = {
  en: { nextMonth: "Next month", previousMonth: "Previous month" },
  fr: { nextMonth: "Mois prochain", previousMonth: "Moi précédent" },
};

const DatePicker: React.FC = () => {
  const [locale, setLocale] = React.useState<string>("en");

  return (
    <div>
      <p>
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </p>
      <DayPicker
        locale={locale}
        months={MONTHS[locale]}
        weekdaysLong={WEEKDAYS_LONG[locale]}
        weekdaysShort={WEEKDAYS_SHORT[locale]}
        firstDayOfWeek={FIRST_DAY_OF_WEEK[locale]}
        labels={LABELS[locale]}
      />
    </div>
  );
};

export { DatePicker };
