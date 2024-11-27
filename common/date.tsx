import { format, parseISO } from "date-fns";

interface DateProps {
  timestamp: string | Date; // String for MongoDB format or JS Date
}

const months = [
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
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getDay = ({ timestamp }: any) => {
  const date = parseISO(timestamp); // Parse the ISO date string
  return format(date, "d MMMM"); // Format as "30 October"
};

export default getDay;

export const getFullDay = ({ timestamp }: any) => {
  const date = parseISO(timestamp);
  return format(date, "EEEE d MMMM yyyy"); // Format as "Tuesday 30 October 2024"
};

// const days_fr = [
//   "Dimanche",
//   "Lundi",
//   "Mardi",
//   "Mercredi",
//   "Jeudi",
//   "Vendredi",
//   "Samedi",
// ];

// // months in french
// const months_fr = [
//   "Janvier",
//   "Fevrier",
//   "Mars",
//   "Avril",
//   "Mai",
//   "Juin",
//   "Juillet",
//   "Aout",
//   "Septembre",
//   "Octobre",
//   "Novembre",
//   "Decembre",
// ];
