/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const IconGroups = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" style={style} {...props}>
    <path d="M12 6.75C13.63 6.75 15.07 7.14 16.24 7.65C17.32 8.13 18 9.21 18 10.38V12H6V10.39C6 9.21 6.68 8.13 7.76 7.66C8.93 7.14 10.37 6.75 12 6.75ZM4 7C5.1 7 6 6.1 6 5C6 3.9 5.1 3 4 3C2.9 3 2 3.9 2 5C2 6.1 2.9 7 4 7ZM5.13 8.1C4.76 8.04 4.39 8 4 8C3.01 8 2.07 8.21 1.22 8.58C0.48 8.9 0 9.62 0 10.43V12H4.5V10.39C4.5 9.56 4.73 8.78 5.13 8.1ZM20 7C21.1 7 22 6.1 22 5C22 3.9 21.1 3 20 3C18.9 3 18 3.9 18 5C18 6.1 18.9 7 20 7ZM24 10.43C24 9.62 23.52 8.9 22.78 8.58C21.93 8.21 20.99 8 20 8C19.61 8 19.24 8.04 18.87 8.1C19.27 8.78 19.5 9.56 19.5 10.39V12H24V10.43ZM12 0C13.66 0 15 1.34 15 3C15 4.66 13.66 6 12 6C10.34 6 9 4.66 9 3C9 1.34 10.34 0 12 0Z" fill="currentColor" />
  </svg>
);

export const IconLibraryBooks = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style} {...props}>
    <path d="M2 4H0V18C0 19.1 0.9 20 2 20H16V18H2V4ZM18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM17 9H7V7H17V9ZM13 13H7V11H13V13ZM17 5H7V3H17V5Z" fill="currentColor" />
  </svg>
);

export const IconEtapas = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="17" height="22" viewBox="0 0 17 22" fill="none" style={style} {...props}>
    <path d="M10 8V10H7V8H4.5V6H7V0H0V6H2.5V8H0V14H2.5V16H0V22H7V16H4.5V14H7V12H10V14H17V8H10Z" fill="currentColor" />
  </svg>
);

export const IconLock = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="16" height="21" viewBox="0 0 16 21" fill="none" style={style} {...props}>
    <path d="M14 7H13V5C13 2.24 10.76 0 8 0C5.24 0 3 2.24 3 5V7H2C0.9 7 0 7.9 0 9V19C0 20.1 0.9 21 2 21H14C15.1 21 16 20.1 16 19V9C16 7.9 15.1 7 14 7ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM11.1 7H4.9V5C4.9 3.29 6.29 1.9 8 1.9C9.71 1.9 11.1 3.29 11.1 5V7Z" fill="currentColor" />
  </svg>
);

export const IconPerson = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style} {...props}>
    <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor" />
  </svg>
);

export const IconInsertDriveFile = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" style={style} {...props}>
    <path d="M2 0C0.9 0 0.0100002 0.9 0.0100002 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6L10 0H2ZM9 7V1.5L14.5 7H9Z" fill="currentColor" />
  </svg>
);

export const ICON_MAP = {
  groups:            IconGroups,
  library_books:     IconLibraryBooks,
  etapas:            IconEtapas,
  lock:              IconLock,
  person:            IconPerson,
  insert_drive_file: IconInsertDriveFile,
  account_balance:   AccountBalanceIcon,
};
