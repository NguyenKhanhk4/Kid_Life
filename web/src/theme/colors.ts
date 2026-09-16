/** KidLife Design Tokens — Web App theme */

export const colors = {
  primary: '#2B44E8',
  primaryDark: '#1B2A9D',
  primarySoft: '#E9EDFF',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  text: '#1B205D',
  muted: '#7D87AC',
  border: '#E7EAF5',
  lime: '#C9ED3A',
  limeDark: '#6A8615',
  orange: '#FFA900',
  orangeSoft: '#FFF2D5',
  purple: '#8E54E9',
  purpleSoft: '#F0E9FF',
  green: '#28B978',
  greenSoft: '#E4F8EE',
  red: '#F26969',
  redSoft: '#FFE8E8',
  shadow: '#15205B',
  yellow: '#FFD233',
  taskCompleted: '#C9ED3A',
  taskPending: '#E8EDFC',
  messageBg: '#EAF4D0',
  messageText: '#4F7009',
} as const;

export type Colors = typeof colors;
