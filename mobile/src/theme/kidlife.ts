import { StyleSheet } from 'react-native';

/** Visual tokens shared by the KidLife mobile experiences. */
export const kidlifeColors = {
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
};

export const kidlifeLayout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: kidlifeColors.background },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  card: {
    backgroundColor: kidlifeColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: kidlifeColors.border,
    shadowColor: kidlifeColors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  sectionTitle: {
    color: kidlifeColors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: { color: kidlifeColors.muted, fontSize: 13, lineHeight: 19 },
  pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
});

export type KidLifeColors = typeof kidlifeColors;
